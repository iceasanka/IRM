import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Modal, Alert, TouchableOpacity, Button, SafeAreaView, ScrollView } from 'react-native';
import BarcodeScanner from '../../BarcodeScanner.js';
import { apigetStockByItemCode, updateStock, apigetItemWithDetailsByBarcode, apigetItemByDescription, getPriceLink, getAllReturnItemsBySuppCode, apiProcessReturnItems, apiAddReturnItem, apiUpdateItemById, apigetSuppByDescription, apiPrint, apiDeleteItemById } from '../../api.js';
import RetunItemListPage from './RetunItemListPage.js';


const ReturnPage = () => {

  const [_modalVisible, setModalVisible] = useState(false);
  const [_description, setDescription] = useState('');
  const inputRef2 = useRef(null);
  const [_suggestions, setSuggestions] = useState([]);
  const [_itemCode, setItemCode] = useState('');
  const [_items, setItems] = useState({});
  const [_stock, setStock] = useState('');
  const [_barcode, setBarcode] = useState('');
  const inputRef = useRef(null);
  const [_scanning, setScanning] = useState(false);
  const [_retunQty, setReturnQty] = useState('');
  const [_returnItems, setReturnItems] = useState<ReturnItem[]>([]);

  const [_suppSuggestions, setSuppSuggestions] = useState([]);
  const [_suppCode, setSuppCode] = useState('');
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

        if (response.data == '') {
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

      if (!suppCode || suppCode.trim() === '') {
        Alert.alert("Invalid Input", "Please enter supplier Code.");
        return;
      }

      const response = await getAllReturnItemsBySuppCode(suppCode);

      if (response.data == '') {
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
            style: "cancel"
          },
          { text: "OK", onPress: () => AddReturnItem(id) }
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
        Date: new Date().toISOString().split('T')[0],
        Cost_Price: _items.cost_Price,
        ERet_Price: _items.eRet_Price,
        Qty: parseFloat(_retunQty)
      };

      const response = await apiAddReturnItem(returnItem);

      setReturnItems((prevItems) => [...prevItems, response.data]);

      setReturnQty('');

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

  const passData = () => {

    setBarcode('8718719850008');
    GetItemDetails(_barcode);

  };

  const clearForm = () => {
    setBarcode('');
    setItemCode('');
    setDescription('');
    setItems({});
    setStock('');
    setReturnQty('');
    setSuggestions([]);
    //setPriceLink('');
    setReturnItems([]);
    setSupplier({});
    setSuppCode('');
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
                  item.selected ? { ...item, status: 2, statusText: "Returned", selected: false } : item
                )
              );

              Alert.alert("Done", "Selected items have been marked as returned.");
            } catch (error) {
              console.error("Error updating items:", error);
              Alert.alert("Error", "An error occurred while updating items. Please try again.");
            }
          },
        },
      ]
    );
  };


  const ProcessSelectedItems = async () => {
    const itemsToProcess = _returnItems.filter((item) => item.status === 2);

    if (itemsToProcess.length === 0) {
      Alert.alert("No items to process", "There are no items with status returned.");
      return;
    }

    const uniqueSuppCodes = [...new Set(itemsToProcess.map((item) => item.supp_Code))];

    if (uniqueSuppCodes.length > 1) {
      Alert.alert("Validation Error", "Items have different supplier codes. Please ensure all items belong to the same supplier.");
      return;
    }

    if (uniqueSuppCodes[0] !== _suppCode) {
      Alert.alert("Validation Error", "Items do not match the expected supplier code.");
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

              Alert.alert("Success", "All items with status returned have been processed.");

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
              Alert.alert("Error", "An error occurred while processing items. Please try again.");
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
                prevItems.filter((item) => !selectedItems.some((sel) => sel.id === item.id))
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
      Alert.alert("Error", "An error occurred while print items. Please try again.");
    }
  };

  return (
    <View style={_styles.container}>
      <View>
        {/* Itemcode */}
        <View style={_styles.row}>
          <View style={_styles.cell}>
            <Text style={_styles.labelText}>Item Code</Text>
          </View>
          <View style={_styles.cell}>
            <TextInput style={_styles.valueText} value={_items.item_Code} />
          </View>
        </View>

        {/* Barcode */}
        <View style={_styles.row}>
          <View style={_styles.cell}>
            <Text style={_styles.labelText}>Barcode</Text>
          </View>
          <View style={_styles.cell}>
            <TextInput style={_styles.valueText} value={_items.barcode} onChangeText={setBarcode} />
          </View>
        </View>

        {/* Description */}
        <View style={_styles.row}>
          <View style={_styles.cell}>
            <Text style={_styles.labelText}>Description</Text>
          </View>
          <View style={_styles.cell}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <TextInput
                style={_styles.valueText}
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
          <View style={_styles.modalContainer_2}>
            <View style={_styles.popup_2}>
              <TextInput
                ref={inputRef2}
                style={_styles.searchInput}
                //value={description}
                onChangeText={handleDescriptionChange}
                placeholder="Type to search"
              />
              <FlatList
                data={_suggestions}
                keyExtractor={(item) => item.item_Code}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => GetItem(item)} style={_styles.suggestionItem}>
                    <Text style={_styles.suggestionText} >{item.descrip}</Text>
                  </TouchableOpacity>
                )}
                style={_styles.suggestionsList}
              />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

        {/* Add return Item */}
        <View style={_styles.row}>
          <View style={_styles.cell}>
            <Text style={_styles.labelText}>Return Item</Text>
          </View>
          <View style={_styles.cell}>
            <TextInput style={[_styles.inputTextBox /*, { width: 140 }*/]} value={_retunQty} onChangeText={setReturnQty} ref={inputRef} keyboardType="numeric" />
          </View>
        </View>

        {/* Stock */}
        <View style={_styles.row}>
          <View style={_styles.cell}>
            <Text style={_styles.labelText}>Stock</Text>
          </View>
          <View style={_styles.cell}>
            <TextInput style={_styles.valueText} value={_stock.toString()} />
          </View>
        </View>

        <View style={_styles.vw_2}>
          {/* <View style={{ width: 120, padding: 2 }}>
            <Button title="Test" onPress={passData} />
          </View> */}

          <View style={{ width: 120, padding: 2 }}>
            <Button title="Clear" onPress={clearForm} />
          </View>

          <View style={{ width: 120, padding: 2 }}>
            <Button title="Scan" onPress={() => setScanning(true)} />
          </View>

          <View style={{ width: 120, padding: 2 }}>
            <Button title="Add" onPress={() => ConfirmReturnItem('ADD')} />
          </View>

          {/* Barcode scan popup */}
          <Modal
            visible={_scanning}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setScanning(false)}
          >
            <View style={_styles.modalContainer}>
              <View style={_styles.popup}>
                <BarcodeScanner onScan={handleScan} />
                <Button title="Close" onPress={() => setScanning(false)} />
              </View>
            </View>
          </Modal>

        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        {/* Supplier Search */}
        <View style={_styles.row}>
          <View style={_styles.cell}>
            <Text style={_styles.labelText}>Supplier</Text>
          </View>
          <View style={_styles.cell}>
            <TouchableOpacity onPress={() => setsuppModalVisible(true)}>
              <TextInput
                style={_styles.valueText}
                value={_suppCode}
                editable={false}
                placeholder="Touch to search"
              />
            </TouchableOpacity>
          </View>
          <View style={_styles.cell}>
            <Button title='Load' onPress={() => GetReturnItemListBySuppCode(_suppCode)}></Button>
          </View>
        </View>

        {/* Supplier popup */}
        <Modal
          visible={_suppmodalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setsuppModalVisible(false)}
        >
          <View style={_styles.modalContainer_2}>
            <View style={_styles.popup_2}>
              <TextInput
                style={_styles.searchInput}
                onChangeText={handleSuppDesChange}
                placeholder="Type to search"
              />
              <FlatList
                data={_suppSuggestions}
                keyExtractor={(item) => item.supp_Code}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => GetSupplier(item)} style={_styles.suggestionItem}>
                    <Text style={_styles.suggestionText} > {item.supp_Code} - {item.supp_Name}</Text>
                  </TouchableOpacity>
                )}
                style={_styles.suggestionsList}
              />
              <Button title="Close" onPress={() => setsuppModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>

      <View style={_styles.returnGridContainer}>
        <RetunItemListPage data={_returnItems} toggleSelect={toggleSelect} />
      </View>

      <View>
        <View style={_styles.vw_2}>
          <View style={{ width: 120, padding: 2 }}>
            <Button title='Delete' onPress={DeleteItems}></Button>
          </View>
          <View style={{ width: 150, padding: 2 }}>
            <Button title="Return" onPress={UpdateItemsAsReturned} />
          </View>
          <View style={{ width: 120, padding: 2 }}>
            <Button title='Process' onPress={ProcessSelectedItems}></Button>
          </View>

        </View>
      </View>

    </View>
  )
}

const _styles = StyleSheet.create({
  returnGridContainer: {
    //flex: 0.6,
    //padding: 0,
    height: 250,
    //width: 1000,
    // backgroundColor: 'grey',
    //borderWidth: 5,

  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row', // Arrange cells horizontally
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
  },
  cell: {
    flex: 1, // Each cell takes up 50% of the row's width
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  labelText: {
    fontWeight: 'bold',
    color: '#333',
  },
  valueText: {
    color: '#555',
  },
  modalContainer_2: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  popup_2: {
    width: '90%',
    height: '70%',
    marginTop: 60,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 5,
    alignItems: 'center',
  },
  searchInput: {
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    padding: 10,
    marginBottom: 10,
  }, suggestionItem: {
    backgroundColor: 'white',
    padding: 2,
    //borderRadius: 8,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1, // For Android shadow
  },
  suggestionText: {
    color: '#333',
    fontSize: 15,
  },
  suggestionsList: {
    width: '100%',
    // maxHeight: 200, // Limit the height of the list
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 10,
  },
  vw_2: {
    //backgroundColor: 'blue',
    justifyContent: 'flex-end',
    flexDirection: "row",
    alignItems: 'flex-end'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: '90%',
    height: '40%',
    marginTop: 60,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 5,
    alignItems: 'center',
  },

  inputTextBox: {
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 18,
    fontWeight: 'bold',

  },


});

export default ReturnPage
