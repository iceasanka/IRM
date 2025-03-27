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
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import BarcodeScanner from "../../BarcodeScanner.js";
import {
  apigetStockByItemCode,
  updateStock,
  apigetItemWithDetailsByBarcode,
  apigetItemByDescription,
  getPriceLink,
  apigetPosStockByItemCode,
} from "../../api.js";

const StockPage = () => {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [items, setItems] = useState({});
  const [itemCode, setItemCode] = useState("");
  const [refCode, setRefCode] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [addOpStock, setAddOpStock] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const [_priceLink, setPriceLink] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [posStock, setPosStock] = useState("");
  const inputRef2 = useRef(null);

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        if (inputRef2.current) {
          inputRef2.current.focus();
        }
      }, 100);
    }
  }, [modalVisible]);

  useEffect(() => {
    if (barcode) {
      fetchItemDetails(barcode);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
    }
  }, [barcode]);

  const handleScan = (scannedData: React.SetStateAction<string>) => {
    setBarcode(scannedData);
    setScanning(false);
  };

  const fetchItemDetails = async (barcode: string) => {
    try {
      if (barcode) {
        const response = await apigetItemWithDetailsByBarcode(barcode);
        const data = response.data;
        if (response.data == "") {
          clearForm();
        } else {
          setItemCode(data.item_Code);
          setRefCode(data.ref_Code);
          setDescription(data.descrip);
          setItems(response.data);

          // Fetch the stock information
          fetchStock(data.item_Code);

          fetchPosStock(data.item_Code);

          fetchPriceLink(data.item_Code);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPriceLink = async (itemCode: any) => {
    try {
      const response = await getPriceLink(itemCode);
      setPriceLink(response.data.map((pl) => pl.price).join(", "));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStock = async (itemCode: string) => {
    try {
      const response = await apigetStockByItemCode(itemCode);

      setStock(response.data.stock);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosStock = async (itemCode: string) => {
    try {
      console.log(itemCode);

      const response = await apigetPosStockByItemCode(itemCode);
      console.log(response.data);
      setPosStock(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStock = async (id) => {
    try {
      const response = await updateStock({
        Id: id,
        Stock: parseFloat(addOpStock),
        item: items,
      });

      fetchStock(itemCode);

      console.log(itemCode);
      setAddOpStock("");
    } catch (error) {
      console.error(error);
    }
  };

  const validateStockInput = (input: string) => {
    const regex = /^[0-9]*\.?[0-9]+$/;
    return regex.test(input);
  };

  const confirmUpdateStock = (id: string) => {
    if (validateStockInput(addOpStock)) {
      Alert.alert(
        "Confirmation",
        "Do you want to update the stock?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "OK", onPress: () => handleUpdateStock(id) },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("Invalid Input", "Please enter a valid number.");
    }
  };

  const clearForm = () => {
    setBarcode("");
    setItemCode("");
    setRefCode("");
    setDescription("");
    setItems({});
    setStock("");
    setAddOpStock("");
    setSuggestions([]);
    setPriceLink("");
    setPosStock("");
  };

  const searchDescriptions = async (query: any) => {
    try {
      const response = await apigetItemByDescription(query);
      setSuggestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
    if (text.length > 0) {
      // start searching when user has typed more than 2 characters
      searchDescriptions(text);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setDescription(suggestion.descrip);
    setSuggestions([]);
    setModalVisible(false);
    fetchItemDetails(suggestion.item_Code);
  };

  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <View style={styles.vw_1}>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Item Code</Text>
              </View>
              <View style={styles.cell}>
                <TextInput style={styles.valueText} value={items.item_Code} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Ref Code</Text>
              </View>
              <View style={styles.cell}>
                <TextInput style={styles.valueText} value={items.ref_Code} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Barcode</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={styles.valueText}
                  value={items.barcode}
                  onChangeText={setBarcode}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Description</Text>
              </View>
              <View style={styles.cell}>
                {/* Touchable area to open the modal */}
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <TextInput
                    style={styles.valueText}
                    value={description}
                    editable={false} // Disable editing in this input box
                    placeholder="Touch to search"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Modal for the search input and suggestions */}
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer_2}>
                <View style={styles.popup_2}>
                  <TextInput
                    ref={inputRef2}
                    style={styles.searchInput}
                    //value={description}
                    onChangeText={handleDescriptionChange}
                    placeholder="Type to search"
                  />
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.item_Code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleSuggestionPress(item)}
                        style={styles.suggestionItem}
                      >
                        <Text style={styles.suggestionText}>
                          {item.descrip}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={styles.suggestionsList}
                  />
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Price</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={styles.valueText}
                  value={items.eRet_Price ? items.eRet_Price.toString() : ""}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Discount</Text>
              </View>
              <View style={styles.cell}>
                <TextInput style={styles.valueText} value={items.tax3} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Price Link</Text>
              </View>
              <View style={styles.cell}>
                <TextInput style={styles.valueText} value={_priceLink} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Stock</Text>
              </View>
              <View style={styles.cell}>
                <TextInput style={styles.valueText} value={stock.toString()} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Pos Stock</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={styles.valueText}
                  value={posStock.toString()}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Add/OpStock</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={[styles.inputTextBox /*, { width: 140 }*/]}
                  value={addOpStock}
                  onChangeText={setAddOpStock}
                  ref={inputRef}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.vw_3}>
            <View style={{ width: 130, padding: 2 }}>
              <TouchableOpacity
                style={styles.addLinkButton}
                onPress={() => confirmUpdateStock("OPB")}
              >
                <Text style={styles.buttonText}>Opning Stock</Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: 120, padding: 2 }}>
              <TouchableOpacity
                style={styles.addLinkButton}
                onPress={() => confirmUpdateStock("ADD")}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.vw_2}>
            <View style={{ width: 120, padding: 2 }}>
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
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setScanning(false)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View style={{ width: 120, padding: 2 }}>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setScanning(true)}
              >
                <Text style={styles.buttonText}>Scan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  suggestionsList: {
    width: "100%",
    // maxHeight: 200, // Limit the height of the list
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
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
  searchInput: {
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  vw_1: {},

  vw_2: {
    //backgroundColor: 'blue',
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  vw_3: {
    //backgroundColor: 'blue',
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "flex-end",
    //flex: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    width: "90%",
    height: "40%",
    marginTop: 60,
    backgroundColor: "white",
    borderRadius: 0,
    padding: 5,
    alignItems: "center",
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

  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: "row", // Arrange cells horizontally
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 5,
  },
  cell: {
    flex: 1, // Each cell takes up 50% of the row's width
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  labelText: {
    fontWeight: "bold",
    color: "#333",
  },
  valueText: {
    color: "#555",
  },
  inputTextBox: {
    borderColor: "gray",
    borderWidth: 1,
    fontSize: 18,
    fontWeight: "bold",
  },
  inputTextBoxDes: {
    borderColor: "gray",
    borderWidth: 1,
    color: "#555",
    //fontSize: 18,
    //fontWeight: 'bold',
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

export default StockPage;
