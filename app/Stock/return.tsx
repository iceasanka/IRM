import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import BarcodeScanner from "../../BarcodeScanner.js";
import {
  apigetStockByItemCode,
  updateStock,
  apigetItemWithDetailsByBarcode,
  apigetItemByDescription,
  getPriceLink,
  getAllReturnItemsBySuppCode,
  apiProcessReturnItems,
  apiAddReturnItem,
  apiUpdateItemById,
  apigetSuppByDescription,
  apiPrint,
  apiDeleteItemById,
} from "../../api.js";
import RetunItemListPage from "./RetunItemListPage.js";
import returnStyles from "./returnStyles";

const ReturnPage = () => {
  const [_modalVisible, setModalVisible] = useState(false);
  const [_description, setDescription] = useState("");
  const inputRef2 = useRef(null);
  const [_suggestions, setSuggestions] = useState([]);
  const [_itemCode, setItemCode] = useState("");
  const [_items, setItems] = useState({});
  const [_stock, setStock] = useState("");
  const [_barcode, setBarcode] = useState("");
  const inputRef = useRef(null);
  const [_scanning, setScanning] = useState(false);
  const [_retunQty, setReturnQty] = useState("");
  const [_returnItems, setReturnItems] = useState<ReturnItem[]>([]);

  const [_suppSuggestions, setSuppSuggestions] = useState([]);
  const [_suppCode, setSuppCode] = useState("");
  const [_supplier, setSupplier] = useState({});
  const [_suppmodalVisible, setsuppModalVisible] = useState(false);

  interface ReturnItem {
    id: number;
    name: string;
    selected: boolean;
  }

  useEffect(() => {
    if (_modalVisible) {
      setTimeout(() => {
        if (inputRef2.current) {
          inputRef2.current.focus();
        }
      }, 100);
    }
  }, [_modalVisible]);

  useEffect(() => {
    if (_barcode) {
      GetItemDetails(_barcode);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
    }
  }, [_barcode]);

  const GetItem = (suggestion) => {
    try {
      setDescription(suggestion.descrip);
      setSuggestions([]);
      setModalVisible(false);
      GetItemDetails(suggestion.item_Code);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDescriptionChange = (text) => {
    try {
      setDescription(text);

      if (text.length > 0) {
        SearchByDescription(text);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const SearchByDescription = async (query: any) => {
    try {
      const response = await apigetItemByDescription(query);

      setSuggestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const GetItemDetails = async (barcode: string) => {
    try {
      if (barcode) {
        const response = await apigetItemWithDetailsByBarcode(barcode);

        const data = response.data;

        if (response.data == "") {
          clearForm();
        } else {
          setItemCode(data.item_Code);
          setDescription(data.descrip);
          setItems(response.data);
          setSuppCode(response.data.supp_Code);

          GetStock(data.item_Code);
          //GetReturnItemListBySuppCode(data.supp_Code)
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetStock = async (itemCode: string) => {
    try {
      const response = await apigetStockByItemCode(itemCode);

      setStock(response.data.stock);
    } catch (error) {
      console.error(error);
    }
  };

  const GetReturnItemListBySuppCode = async (suppCode: string) => {
    try {
      if (!suppCode || suppCode.trim() === "") {
        Alert.alert("Invalid Input", "Please enter supplier Code.");
        return;
      }

      const response = await getAllReturnItemsBySuppCode(suppCode);

      if (response.data == "") {
        //clearForm();
      } else {
        setReturnItems(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ConfirmReturnItem = (id: string) => {
    if (validateInput(_retunQty)) {
      Alert.alert(
        "Confirmation",
        "Do you want to Add Return Item?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "OK", onPress: () => AddReturnItem(id) },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("Invalid Input", "Please enter a valid number.");
    }
  };

  const AddReturnItem = async (id) => {
    try {
      const returnItem = {
        Item_Code: _items.item_Code,
        Ref_Code: _items.ref_Code,
        Barcode: _items.barcode,
        Descrip: _items.descrip,
        Supp_Code: _items.supp_Code,
        Status: 1,
        Date: new Date().toISOString().split("T")[0],
        Cost_Price: _items.cost_Price,
        ERet_Price: _items.eRet_Price,
        Qty: parseFloat(_retunQty),
      };

      const response = await apiAddReturnItem(returnItem);

      setReturnItems((prevItems) => [...prevItems, response.data]);

      setReturnQty("");
    } catch (error) {
      console.error(error);
    }
  };

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

  const clearForm = () => {
    setBarcode("");
    setItemCode("");
    setDescription("");
    setItems({});
    setStock("");
    setReturnQty("");
    setSuggestions([]);
    //setPriceLink('');
    setReturnItems([]);
    setSupplier({});
    setSuppCode("");
    setSuppSuggestions([]);
  };

  const handleScan = (scannedData: React.SetStateAction<string>) => {
    setBarcode(scannedData);
    setScanning(false);
  };

  const validateInput = (input: string) => {
    const regex = /^[0-9]*\.?[0-9]+$/;
    return regex.test(input);
  };

  const toggleSelect = (id) => {
    setReturnItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const UpdateItemsAsReturned = async () => {
    const selectedItems = _returnItems.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      Alert.alert("No items selected", "Please select items to return.");
      return;
    }

    Alert.alert(
      "Return Confirmation",
      "Do you want to mark the selected items as returned?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              for (const item of selectedItems) {
                const updatedItem = { ...item, status: 2 };

                await apiUpdateItemById(item.id, updatedItem);
              }

              // After updating, update the local state to reflect the changes
              setReturnItems((prevItems) =>
                prevItems.map((item) =>
                  item.selected
                    ? {
                        ...item,
                        status: 2,
                        statusText: "Returned",
                        selected: false,
                      }
                    : item
                )
              );

              Alert.alert(
                "Done",
                "Selected items have been marked as returned."
              );
            } catch (error) {
              console.error("Error updating items:", error);
              Alert.alert(
                "Error",
                "An error occurred while updating items. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const ProcessSelectedItems = async () => {
    const itemsToProcess = _returnItems.filter((item) => item.status === 2);

    if (itemsToProcess.length === 0) {
      Alert.alert(
        "No items to process",
        "There are no items with status returned."
      );
      return;
    }

    const uniqueSuppCodes = [
      ...new Set(itemsToProcess.map((item) => item.supp_Code)),
    ];

    if (uniqueSuppCodes.length > 1) {
      Alert.alert(
        "Validation Error",
        "Items have different supplier codes. Please ensure all items belong to the same supplier."
      );
      return;
    }

    if (uniqueSuppCodes[0] !== _suppCode) {
      Alert.alert(
        "Validation Error",
        "Items do not match the expected supplier code."
      );
      return;
    }

    Alert.alert(
      "Process Confirmation",
      "Do you want to process the selected items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await apiProcessReturnItems(itemsToProcess);

              setReturnItems((prevItems) =>
                prevItems.filter((item) => item.status !== 2)
              );

              Alert.alert(
                "Success",
                "All items with status returned have been processed."
              );

              if (response.data.print) {
                Alert.alert(
                  "Print Confirmation",
                  "Do you want to print a copy?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        printProcessedData(itemsToProcess);
                      },
                    },
                  ]
                );
              }
            } catch (error) {
              console.error("Error processing items:", error);
              Alert.alert(
                "Error",
                "An error occurred while processing items. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const DeleteItems = async () => {
    const selectedItems = _returnItems.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      Alert.alert("No items selected", "Please select items to delete.");
      return;
    }

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete the selected items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              for (const item of selectedItems) {
                await apiDeleteItemById(item.id);
              }

              // Update the state to remove the deleted items
              setReturnItems((prevItems) =>
                prevItems.filter(
                  (item) => !selectedItems.some((sel) => sel.id === item.id)
                )
              );

              Alert.alert("Done", "Selected items have been deleted.");
            } catch (error) {
              console.error("Error deleting items:", error);
              Alert.alert("Error", "An error occurred while deleting items.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const printProcessedData = async (items) => {
    if (items.length === 0) {
      Alert.alert("No items to print", "There are no items.");
      return;
    }
    try {
      await apiPrint(items);
    } catch (error) {
      console.error("Error print items:", error);
      Alert.alert(
        "Error",
        "An error occurred while print items. Please try again."
      );
    }
  };

  return (
    <View style={returnStyles.container}>
      <View>
        {/* Itemcode */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Item Code</Text>
          </View>
          <View style={returnStyles.cell}>
            <TextInput
              style={returnStyles.valueText}
              value={_items.item_Code}
            />
          </View>
        </View>

        {/* Barcode */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Barcode</Text>
          </View>
          <View style={returnStyles.cell}>
            <TextInput
              style={returnStyles.valueText}
              value={_items.barcode}
              onChangeText={setBarcode}
            />
          </View>
        </View>

        {/* Description */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Description</Text>
          </View>
          <View style={returnStyles.cell}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <TextInput
                style={returnStyles.valueText}
                value={_description}
                editable={false}
                placeholder="Touch to search"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description popup */}
        <Modal
          visible={_modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={returnStyles.modalContainer_2}>
            <View style={returnStyles.popup_2}>
              <TextInput
                ref={inputRef2}
                style={returnStyles.searchInput}
                onChangeText={handleDescriptionChange}
                placeholder="Type to search"
              />
              <FlatList
                data={_suggestions}
                keyExtractor={(item) => item.item_Code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => GetItem(item)}
                    style={returnStyles.suggestionItem}
                  >
                    <Text style={returnStyles.suggestionText}>
                      {item.descrip}
                    </Text>
                  </TouchableOpacity>
                )}
                style={returnStyles.suggestionsList}
              />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

        {/* Add return Item */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Return Item</Text>
          </View>
          <View style={returnStyles.cell}>
            <TextInput
              style={[returnStyles.inputTextBox /*, { width: 140 }*/]}
              value={_retunQty}
              onChangeText={setReturnQty}
              ref={inputRef}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Stock */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Stock</Text>
          </View>
          <View style={returnStyles.cell}>
            <TextInput
              style={returnStyles.valueText}
              value={_stock.toString()}
            />
          </View>
        </View>

        <View style={returnStyles.vw_2}>
          {/* <View style={{ width: 120, padding: 2 }}>
            <Button title="Test" onPress={passData} />
          </View> */}

          <View style={{ width: 120, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.clearButton}
              onPress={clearForm}
            >
              <Text style={returnStyles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: 120, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.scanButton}
              onPress={() => setScanning(true)}
            >
              <Text style={returnStyles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: 120, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.addLinkButton}
              onPress={() => ConfirmReturnItem("ADD")}
            >
              <Text style={returnStyles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Barcode scan popup */}
          <Modal
            visible={_scanning}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setScanning(false)}
          >
            <View style={returnStyles.modalContainer}>
              <View style={returnStyles.popup}>
                <BarcodeScanner onScan={handleScan} />
                <Button title="Close" onPress={() => setScanning(false)} />
              </View>
            </View>
          </Modal>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        {/* Supplier Search */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Supplier</Text>
          </View>
          <View style={returnStyles.cell}>
            <TouchableOpacity onPress={() => setsuppModalVisible(true)}>
              <TextInput
                style={returnStyles.valueText}
                value={_suppCode}
                editable={false}
                placeholder="Touch to search"
              />
            </TouchableOpacity>
          </View>
          <View style={returnStyles.cell}>
            <TouchableOpacity
              style={returnStyles.addLinkButton}
              onPress={() => GetReturnItemListBySuppCode(_suppCode)}
            >
              <Text style={returnStyles.buttonText}>Load</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Supplier popup */}
        <Modal
          visible={_suppmodalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setsuppModalVisible(false)}
        >
          <View style={returnStyles.modalContainer_2}>
            <View style={returnStyles.popup_2}>
              <TextInput
                style={returnStyles.searchInput}
                onChangeText={handleSuppDesChange}
                placeholder="Type to search"
              />
              <FlatList
                data={_suppSuggestions}
                keyExtractor={(item) => item.supp_Code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => GetSupplier(item)}
                    style={returnStyles.suggestionItem}
                  >
                    <Text style={returnStyles.suggestionText}>
                      {" "}
                      {item.supp_Code} - {item.supp_Name}
                    </Text>
                  </TouchableOpacity>
                )}
                style={returnStyles.suggestionsList}
              />
              <Button
                title="Close"
                onPress={() => setsuppModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </View>

      <View style={returnStyles.returnGridContainer}>
        <RetunItemListPage data={_returnItems} toggleSelect={toggleSelect} />
      </View>

      <View>
        <View style={returnStyles.vw_2}>
          <View style={{ width: 120, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.deleteButton}
              onPress={DeleteItems}
            >
              <Text style={returnStyles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: 150, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.addLinkButton}
              onPress={UpdateItemsAsReturned}
            >
              <Text style={returnStyles.buttonText}>Return</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: 120, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.scanButton}
              onPress={ProcessSelectedItems}
            >
              <Text style={returnStyles.buttonText}>Process</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReturnPage;
