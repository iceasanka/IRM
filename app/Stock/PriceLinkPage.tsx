import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import BarcodeScanner from "../../BarcodeScanner";
import {
  apigetItemWithDetailsByBarcode,
  getPriceLink,
  addPriceLink,
} from "../../api";

const PriceLinkPage = () => {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [itemCode, setItemCode] = useState("");
  const [itemDescrip, setItemDescrip] = useState("");
  const [costPrice, setCostPrice] = useState(0);
  const [packSize, setPackSize] = useState(1);
  const [priceLinks, setPriceLinks] = useState<{ price: number }[]>([]);
  const [newPrice, setNewPrice] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (barcode) {
      fetchItemDetails(barcode);
    }
  }, [barcode]);

  const handleScan = (scannedData: string) => {
    setBarcode(scannedData);
    setScanning(false);
  };

  const fetchItemDetails = async (barcode: string) => {
    try {
      const response = await apigetItemWithDetailsByBarcode(barcode);
      const data = response.data;
      if (data) {
        setItemCode(data.item_Code);
        setItemDescrip(data.descrip);
        setCostPrice(data.cost_Price);
        setPackSize(data.pack_Size);
        fetchPriceLinks(data.item_Code);
      } else {
        clearForm();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPriceLinks = async (itemCode: string) => {
    try {
      const response = await getPriceLink(itemCode);
      setPriceLinks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePriceLink = async (price: number) => {
    try {
      const data = {
        itemCode,
        itemDescrip,
        loca: "01",
        userName: "EASYWAY",
        status: 0,
        price: parseFloat(price.toString()),
        costPrice,
        packSize,
        eWholePrice: 0,
        pRetPrice: 0,
        pWholePrice: 0,
        isUpdateAllLocation: 1,
      };
      await addPriceLink(data);
      fetchPriceLinks(itemCode);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPriceLink = async () => {
    try {
      const data = {
        itemCode,
        itemDescrip,
        loca: "01",
        userName: "EASYWAY",
        status: 1,
        price: parseFloat(newPrice),
        costPrice,
        packSize,
        eWholePrice: 0,
        pRetPrice: 0,
        pWholePrice: 0,
        isUpdateAllLocation: 1,
      };
      await addPriceLink(data);
      fetchPriceLinks(itemCode);
      setNewPrice("");
    } catch (error) {
      console.error(error);
    }
  };

  const clearForm = () => {
    setBarcode("");
    setItemCode("");
    setItemDescrip("");
    setCostPrice(0);
    setPackSize(1);
    setPriceLinks([]);
    setNewPrice("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.labelText}>Bar code</Text>
        <TextInput
          style={styles.valueText}
          value={barcode}
          onChangeText={setBarcode}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.labelText}>Item Code</Text>
        <TextInput
          style={styles.valueText}
          value={itemCode}
          // editable={false}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.labelText}>Des.</Text>
        <TextInput
          style={styles.valueText}
          value={itemDescrip}
          //editable={false}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.labelText}>Price Links</Text>
        <FlatList
          data={priceLinks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }: { item: { price: number } }) => (
            <View style={styles.priceLinkRow}>
              <Text style={styles.priceText}>{item.price}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePriceLink(item.price)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Text style={[styles.labelText, { flex: 1 }]}>New Price</Text>
        <TextInput
          style={[styles.valueText, { flex: 2, marginRight: 10 }]}
          value={newPrice}
          onChangeText={setNewPrice}
          keyboardType="numeric"
          ref={inputRef}
        />
        <TouchableOpacity
          style={styles.addLinkButton}
          onPress={handleAddPriceLink}
        >
          <Text style={styles.buttonText}>Add Link</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightButtonContainer}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScanning(true)}
        >
          <Text style={styles.buttonText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={scanning}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setScanning(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <BarcodeScanner onScan={handleScan} />
            <Button title="Close" onPress={() => setScanning(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  labelText: {
    fontWeight: "bold",
    flex: 1,
  },
  valueText: {
    flex: 2,
    borderColor: "gray",
    borderWidth: 1,
    padding: 5,
  },

  priceLinkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  priceText: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    width: "90%",
    height: "50%",
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },

  rightButtonContainer: {
    alignSelf: "flex-end", // Align the container to the right
    marginBottom: 10, // Add space between buttons and the New Price section
  },
  scanButton: {
    width: 100, // Fixed width
    height: 100, // Fixed height
    backgroundColor: "#007BFF", // Background color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10, // Rounded corners
    marginBottom: 10, // Space between buttons
  },
  clearButton: {
    width: 100, // Fixed width
    height: 50, // Fixed height
    backgroundColor: "#DC3545", // Background color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10, // Rounded corners
  },
  buttonText: {
    color: "white", // Text color
    fontSize: 16, // Text size
    fontWeight: "bold", // Text weight
  },
  addLinkButton: {
    backgroundColor: "#28a745", // Green background
    padding: 10, // Padding
    borderRadius: 5, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#DC3545", // Red background
    padding: 10, // Padding
    borderRadius: 5, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PriceLinkPage;
