import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
  GestureResponderEvent,
} from "react-native";
import BarcodeScanner from "../../BarcodeScanner.js";
import {
  apigetItemWithDetailsByBarcode,
  apiAddGrn,
  apiDeleteGrn,
  apigetSuppByDescription,
  apiGetGrnTempByGrnReferenceAndStatus,
} from "../../api.js";
import GrnList from "./GrnList.js";

const GrnPage: React.FC = () => {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const itemRefInputRef = useRef<TextInput>(null); // Ref for ItemRefCode input

  const [itemDetails, setItemDetails] = useState<any>(null);
  const [gridData, setGridData] = useState<any[]>([]);
  const [formValues, setFormValues] = useState({
    ItemRefCode: "",
    CostPrice: "",
    ERetPrice: "",
    Qty: "",
  });
  const [_returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const qtyInputRef = useRef<TextInput>(null);
  const itemRefCounter = useRef<number>(1);
  const [successMessage, setSuccessMessage] = useState("");

  interface ReturnItem {
    id: number;
    selected: boolean;
    barCode: string;
    itemCode: string;
    descrip: string;
    date: string;
    status: number;
    grnReference: string;
    itemRefCode: string;
    costPrice: number;
    eRetPrice: number;
    qty: number;
  }
  const [_suppmodalVisible, setsuppModalVisible] = useState(false);
  const [_suppSuggestions, setSuppSuggestions] = useState([]);
  const [_suppCode, setSuppCode] = useState("");
  const [_supplier, setSupplier] = useState({});

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
      //console.log("Item details:", data); // Log the item details
      if (data) {
        setItemDetails(data);
        setFormValues({
          ItemRefCode: itemRefCounter.current.toString(), // Reset ItemRefCode
          CostPrice: "",
          ERetPrice: "",
          Qty: "",
        });
        setSuppCode(response.data.supp_Code);

        // Focus on the ItemRefCode input after receiving item details
        setTimeout(() => {
          itemRefInputRef.current?.focus();
        }, 100);
      } else {
        clearForm();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveTempGrn = async () => {
    if (!itemDetails) {
      Alert.alert("Error", "Please scan a barcode first.");
      return;
    }

    if (!itemDetails.barcode) {
      Alert.alert("Error", "Bar code is required.");
      return;
    }

    if (!formValues.ItemRefCode) {
      Alert.alert("Error", "Item Ref Code is required.");
      return;
    }
    if (!formValues.Qty) {
      Alert.alert("Error", "Quantity is required.");
      return;
    }

    const grnTemp = {
      BarCode: itemDetails?.barcode,
      ItemCode: itemDetails?.item_Code,
      Descrip: itemDetails?.descrip,
      Date: new Date().toISOString(),
      Status: 1,
      GrnReference: itemDetails?.supp_Code,
      ItemRefCode: formValues.ItemRefCode,
      CostPrice: parseFloat(formValues.CostPrice),
      ERetPrice: parseFloat(formValues.ERetPrice),
      Qty: parseFloat(formValues.Qty),
    };

    try {
      const _response = await apiAddGrn(grnTemp);
      const added = _response.data.data;

      const _item: ReturnItem = {
        ...added,
        selected: false,
      };

      setReturnItems((prevItems) => [...prevItems, _item]);
      itemRefCounter.current += 1;

      //Alert.alert("Success", _response.data.message);
      // toast.success(_response.data.message);
      setSuccessMessage(_response.data.message);
      setTimeout(() => setSuccessMessage(""), 2000); // Hide after 3 seconds

      clearForm();
    } catch (error) {
      Alert.alert("Error", "Failed to save record.");
    }
  };

  const toggleSelect = (id) => {
    setReturnItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const clearForm = () => {
    setBarcode("");
    setItemDetails(null);
    setFormValues({
      ItemRefCode: "",
      CostPrice: "",
      ERetPrice: "",
      Qty: "",
    });

    // Focus on the ItemRefCode input after clearing the form
    setTimeout(() => {
      itemRefInputRef.current?.focus();
    }, 100);
  };

  const clearAllForm = () => {
    clearForm();
    setReturnItems([]);
    setSupplier({});
    setSuppCode("");
    setSuppSuggestions([]);
    itemRefCounter.current = 1;
  };

  function DeleteItems(event: GestureResponderEvent): void {
    const selectedItems = _returnItems.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      Alert.alert("No items selected", "Please select items to delete.");
      return;
    }
    // check more than 1 item selected
    if (selectedItems.length > 1) {
      Alert.alert("Error", "Please select only one item to delete.");
      return;
    }

    console.log("Selected items:", selectedItems); // Log the selected items

    Alert.alert("Delete", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          const _response = await apiDeleteGrn(selectedItems[0].id);
          const deleted = _response.data.data;
          //id deleted then remove form grid
          if (deleted) {
            Alert.alert("Success", _response.data.message);

            setReturnItems((prevItems) =>
              prevItems.filter((item) => !item.selected)
            );
          }
        },
      },
    ]);
  }

  async function GetGrnItemsByGrnRef(_suppCode: string): Promise<void> {
    try {
      if (!_suppCode || _suppCode.trim() === "") {
        Alert.alert("Invalid Input", "Please enter supplier Code.");
        return;
      }

      const response = await apiGetGrnTempByGrnReferenceAndStatus(_suppCode, 1);

      const data = response.data.data;
      //clear retun items and add new items
      setReturnItems([]);
      if (data.length > 0) {
        const updatedItems = data.map((item) => ({
          ...item,
          selected: false,
        }));
        setReturnItems(updatedItems);
      } else {
        Alert.alert(
          "No items found",
          "No items found for the given supplier code."
        );
        setReturnItems([]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSuppDesChange = (text) => {
    try {
      setSuppCode(text);

      if (text.length > 0) {
        SearchBySuppDes(text);
      } else {
        setSuppSuggestions([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const SearchBySuppDes = async (query: any) => {
    try {
      const response = await apigetSuppByDescription(query);
      setSuppSuggestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const GetSupplier = (suggestion) => {
    try {
      setSuppCode(suggestion.supp_Code);
      setSuppSuggestions([]);
      setsuppModalVisible(false);
      setSupplier(suggestion);
    } catch (error) {
      console.error(error);
    }
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
              value={itemDetails?.barcode || ""}
              onChangeText={setBarcode}
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
              value={itemDetails?.descrip || ""}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>ERet Price</Text>
          </View>
          <View style={styles.cell}>
            <TextInput
              style={styles.inputTextBox}
              value={formValues.ERetPrice}
              keyboardType="numeric"
              onChangeText={(text) =>
                setFormValues({ ...formValues, ERetPrice: text })
              }
            />
          </View>
        </View>
        {/* Cost Price */}
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Cost Price</Text>
          </View>
          <View style={styles.cell}>
            <TextInput
              style={styles.inputTextBox}
              keyboardType="numeric"
              value={formValues.CostPrice}
              onChangeText={(text) =>
                setFormValues({ ...formValues, CostPrice: text })
              }
            />
          </View>
        </View>

        {/* Item Ref */}
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Item Ref</Text>
          </View>

          <View style={styles.cell}>
            <TextInput
              style={styles.inputTextBox}
              value={formValues.ItemRefCode}
              returnKeyType="next"
              onChangeText={(text) =>
                setFormValues({ ...formValues, ItemRefCode: text })
              }
              onSubmitEditing={() => qtyInputRef.current?.focus()}
            />
          </View>
        </View>
        {/* Qty */}
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Qty</Text>
          </View>

          <View style={styles.cell}>
            <TextInput
              //ref={qtyInputRef}
              ref={itemRefInputRef} // Attach the ref to the ItemRefCode input
              style={styles.inputTextBox}
              value={formValues.Qty}
              keyboardType="numeric"
              onChangeText={(text) =>
                setFormValues({ ...formValues, Qty: text })
              }
            />
          </View>
        </View>
      </View>

      {/* Bar code scaner function */}
      <View style={styles.rightButtonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAllForm}>
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveTempGrn}>
          <Text style={styles.buttonText}>Save</Text>
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

      {successMessage ? (
        <Text
          style={{ color: "green", fontWeight: "bold", textAlign: "center" }}
        >
          {successMessage}
        </Text>
      ) : null}

      {/* Supplier search */}
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.labelText}>Supplier</Text>
        </View>
        <View style={styles.cell}>
          <TouchableOpacity onPress={() => setsuppModalVisible(true)}>
            <TextInput
              style={styles.valueText}
              value={_suppCode}
              editable={false}
              placeholder="Touch to search"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.cell}>
          <TouchableOpacity
            style={styles.loadButton}
            onPress={() => GetGrnItemsByGrnRef(_suppCode)}
          >
            <Text style={styles.buttonText}>Load</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={_suppmodalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setsuppModalVisible(false)}
      >
        <View style={styles.modalContainer_2}>
          <View style={styles.popup_2}>
            <TextInput
              style={styles.searchInput}
              onChangeText={handleSuppDesChange}
              placeholder="Type to search"
            />
            <FlatList
              data={_suppSuggestions}
              keyExtractor={(item) => item.supp_Code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => GetSupplier(item)}
                  style={styles.suggestionItem}
                >
                  <Text style={styles.suggestionText}>
                    {" "}
                    {item.supp_Code} - {item.supp_Name}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
            <Button title="Close" onPress={() => setsuppModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Data grid */}
      <View style={styles.returnGridContainer}>
        <GrnList data={_returnItems} toggleSelect={toggleSelect} />
      </View>

      <View style={styles.vw_2}>
        <View style={{ width: 120, padding: 2 }}>
          <TouchableOpacity style={styles.deleteButton} onPress={DeleteItems}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: 20,
    fontWeight: "bold",
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
  saveButton: {
    backgroundColor: "#28a745", // Green background
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
    width: 100, // Fixed width
    height: 100, // Fixed height
  },
  loadButton: {
    backgroundColor: "#28a745", // Green background
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
    width: 100, // Fixed width
    height: 50, // Fixed height
  },
  deleteButton: {
    backgroundColor: "#DC3545", // Red background
    padding: 10, // Padding
    borderRadius: 5, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
  },
  returnGridContainer: {
    height: 250,
  },
  vw_2: {
    //backgroundColor: 'blue',
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "flex-end",
  },

  modalContainer_2: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup_2: {
    width: "90%",
    height: "70%",
    marginTop: 60,
    backgroundColor: "white",
    borderRadius: 0,
    padding: 5,
    alignItems: "center",
  },
  searchInput: {
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  suggestionItem: {
    backgroundColor: "white",
    padding: 2,
    //borderRadius: 8,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1, // For Android shadow
  },
  suggestionText: {
    color: "#333",
    fontSize: 15,
  },
  suggestionsList: {
    width: "100%",
    // maxHeight: 200, // Limit the height of the list
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
  },
});

export default GrnPage;
