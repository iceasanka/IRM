import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import BarcodeScanner from "../../BarcodeScanner";
import {
  apigetItemWithDetailsByBarcode,
  getPriceLink,
  addPriceLink,
  updateItemRetPrice,
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
  const [eRetPrice, seteRetPrice] = useState(0);

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
        seteRetPrice(data.eRet_Price);
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

  const handleSaveRetPrice = async () => {
    try {
      await updateItemRetPrice(itemCode, eRetPrice);
      alert("Item Price updated successfully.");
    } catch (error) {
      console.error("Failed to update item price:", error);
      alert("Failed to update item price.");
    }
  };

  const clearForm = () => {
    setBarcode("");
    setItemCode("");
    setItemDescrip("");
    setCostPrice(0);
    seteRetPrice(0);
    setPackSize(1);
    setPriceLinks([]);
    setNewPrice("");
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={[styles.row, , { backgroundColor: "#e9e9e9" }]}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Bar code</Text>
          </View>
          <View style={styles.cell}>
            <TextInput
              style={styles.valueText}
              value={barcode}
              onChangeText={setBarcode}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Item Code</Text>
          </View>
          <View style={styles.cell}>
            <TextInput
              style={styles.valueText}
              value={itemCode}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Des.</Text>
          </View>
          <View style={styles.cell}>
            <TextInput
              style={styles.valueText}
              value={itemDescrip}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Item Price</Text>
          </View>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <TextInput
                style={[styles.inputTextBox, {}]}
                value={eRetPrice.toString()}
                keyboardType="numeric"
                onChangeText={(text) => seteRetPrice(Number(text))}
              />
            </View>
            <View style={{}}>
              <TouchableOpacity
                style={styles.addLinkButton}
                onPress={handleSaveRetPrice}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Price Links</Text>
          </View>
          <View style={styles.cell}>
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
        </View>

        <View style={[styles.row]}>
          <View style={[styles.cell, { width: "50%" }]}>
            <Text style={[styles.labelText]}>New Price</Text>
          </View>
          <View
            style={[
              styles.cell,
              {
                width: "20%",
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-end",
              },
            ]}
          >
            <TextInput
              style={[styles.inputTextBox]}
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
              ref={inputRef}
            />
          </View>
          <View
            style={[
              styles.cell,
              {
                width: "30%",
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-end",
              },
            ]}
          >
            <TouchableOpacity
              style={styles.addLinkButton}
              onPress={handleAddPriceLink}
            >
              <Text style={styles.buttonText}>Add Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.rightButtonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScanning(true)}
        >
          <Text style={styles.buttonText}>Scan</Text>
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
    padding: 5,
  },
  row: {
    flexDirection: "row", // Arrange cells horizontally
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 3,
  },
  cell: {
    flex: 1, // Each cell takes up 50% of the row's width
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cell2: {
    flex: 1, // Each cell takes up 50% of the row's width
    //justifyContent: "center",
    paddingHorizontal: 3,
  },
  labelText: {
    color: "#333",
  },
  valueText: {
    color: "#555",
    fontWeight: "bold",
  },
  inputTextBox: {
    borderColor: "gray",
    borderWidth: 1,
    fontSize: 30,
    fontWeight: "bold",
    flex: 1,
    width: "100%",
  },

  priceLinkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  priceText: {
    flex: 1,
    fontSize: 30,
    color: "#228B22",
    fontWeight: "bold",
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
    flexDirection: "row", // Arrange buttons horizontally
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
    width: 100, // Fixed width
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
