import { useState, useEffect, useRef } from "react";
import {
  apigetStockByItemCode,
  apigetItemWithDetailsByBarcode,
  apigetItemByDescription,
  getAllReturnItemsBySuppCode,
  apiAddReturnItem,
  apiUpdateItemById,
  apigetSuppByDescription,
  apiProcessReturnItems,
  apiPrint,
  apiDeleteItemById,
} from "../../api.js";
import { Alert } from "react-native";

const useReturnPageLogic = () => {
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
  const [_returnItems, setReturnItems] = useState([]);
  const [_suppSuggestions, setSuppSuggestions] = useState([]);
  const [_suppCode, setSuppCode] = useState("");
  const [_supplier, setSupplier] = useState({});
  const [_suppmodalVisible, setsuppModalVisible] = useState(false);

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
    setDescription(suggestion.descrip);
    setSuggestions([]);
    setModalVisible(false);
    GetItemDetails(suggestion.item_Code);
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
    if (text.length > 0) {
      SearchByDescription(text);
    } else {
      setSuggestions([]);
    }
  };

  const SearchByDescription = async (query) => {
    const response = await apigetItemByDescription(query);
    setSuggestions(response.data);
  };

  const GetItemDetails = async (barcode) => {
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
      }
    }
  };

  const GetStock = async (itemCode) => {
    const response = await apigetStockByItemCode(itemCode);
    setStock(response.data.stock);
  };

  const GetReturnItemListBySuppCode = async (suppCode) => {
    if (!suppCode || suppCode.trim() === "") {
      Alert.alert("Invalid Input", "Please enter supplier Code.");
      return;
    }
    const response = await getAllReturnItemsBySuppCode(suppCode);
    if (response.data !== "") {
      setReturnItems(response.data);
    }
  };

  const ConfirmReturnItem = (id) => {
    if (validateInput(_retunQty)) {
      Alert.alert(
        "Confirmation",
        "Do you want to Add Return Item?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => AddReturnItem(id) },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("Invalid Input", "Please enter a valid number.");
    }
  };

  const AddReturnItem = async (id) => {
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
  };

  const handleSuppDesChange = (text) => {
    setSuppCode(text);
    if (text.length > 0) {
      SearchBySuppDes(text);
    } else {
      setSuppSuggestions([]);
    }
  };

  const SearchBySuppDes = async (query) => {
    const response = await apigetSuppByDescription(query);
    setSuppSuggestions(response.data);
  };

  const GetSupplier = (suggestion) => {
    setSuppCode(suggestion.supp_Code);
    setSuppSuggestions([]);
    setsuppModalVisible(false);
    setSupplier(suggestion);
  };

  const clearForm = () => {
    setBarcode("");
    setItemCode("");
    setDescription("");
    setItems({});
    setStock("");
    setReturnQty("");
    setSuggestions([]);
    setReturnItems([]);
    setSupplier({});
    setSuppCode("");
    setSuppSuggestions([]);
  };

  const handleScan = (scannedData) => {
    setBarcode(scannedData);
    setScanning(false);
  };

  const validateInput = (input) => {
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
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            for (const item of selectedItems) {
              const updatedItem = { ...item, status: 2 };
              await apiUpdateItemById(item.id, updatedItem);
            }
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
            Alert.alert("Done", "Selected items have been marked as returned.");
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
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
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
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Yes",
                    onPress: () => printProcessedData(itemsToProcess),
                  },
                ]
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
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            for (const item of selectedItems) {
              await apiDeleteItemById(item.id);
            }
            setReturnItems((prevItems) =>
              prevItems.filter(
                (item) => !selectedItems.some((sel) => sel.id === item.id)
              )
            );
            Alert.alert("Done", "Selected items have been deleted.");
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
    await apiPrint(items);
  };

  return {
    _modalVisible,
    setModalVisible,
    _description,
    setDescription,
    inputRef2,
    _suggestions,
    setSuggestions,
    _itemCode,
    setItemCode,
    _items,
    setItems,
    _stock,
    setStock,
    _barcode,
    setBarcode,
    inputRef,
    _scanning,
    setScanning,
    _retunQty,
    setReturnQty,
    _returnItems,
    setReturnItems,
    _suppSuggestions,
    setSuppSuggestions,
    _suppCode,
    setSuppCode,
    _supplier,
    setSupplier,
    _suppmodalVisible,
    setsuppModalVisible,
    GetItem,
    handleDescriptionChange,
    SearchByDescription,
    GetItemDetails,
    GetStock,
    GetReturnItemListBySuppCode,
    ConfirmReturnItem,
    AddReturnItem,
    handleSuppDesChange,
    SearchBySuppDes,
    GetSupplier,
    clearForm,
    handleScan,
    validateInput,
    toggleSelect,
    UpdateItemsAsReturned,
    ProcessSelectedItems,
    DeleteItems,
    printProcessedData,
  };
};

export default useReturnPageLogic;
