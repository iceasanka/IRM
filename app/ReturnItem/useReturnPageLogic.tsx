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
  const inputRef2 = useRef<any>(null);
  const [_suggestions, setSuggestions] = useState([]);
  const [_itemCode, setItemCode] = useState("");
  interface ItemDetails {
    item_Code: string;
    ref_Code?: string;
    barcode?: string;
    descrip?: string;
    supp_Code?: string;
    cost_Price?: number;
    eRet_Price?: number;
    [key: string]: any;
  }
  const [_items, setItems] = useState<ItemDetails>({ item_Code: "" });
  const [_stock, setStock] = useState("");
  const [_barcode, setBarcode] = useState("");
  const inputRef = useRef<any>(null);
  const [_retunQty, setReturnQty] = useState("");
  type ReturnItem = { [key: string]: any }; // You can define a more specific type if you know the structure
  const [_returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [_suppSuggestions, setSuppSuggestions] = useState([]);
  const [_suppCode, setSuppCode] = useState("");
  const [_supplier, setSupplier] = useState({});
  const [_suppmodalVisible, setsuppModalVisible] = useState(false);
  const [message, setmessage] = useState("");
  const lastScannedRef = useRef<string | null>(null);

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

  const GetItem = (suggestion: any) => {
    setDescription(suggestion.descrip);
    setSuggestions([]);
    setModalVisible(false);
    GetItemDetails(suggestion.item_Code);
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (text.length > 0) {
      SearchByDescription(text);
    } else {
      setSuggestions([]);
    }
  };

  const SearchByDescription = async (query: string) => {
    const response = await apigetItemByDescription(query);
    setSuggestions(response.data);
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
        }
      }
    } catch (error: any) {
      if (error.response) {
        clearForm();
        setmessage(error.response.data);
      }
      return;
    }
  };

  const GetStock = async (itemCode: string) => {
    try {
      const response = await apigetStockByItemCode(itemCode);
      setStock(response.data.stock);
    } catch (error: any) {
      if (error.response) {
        setmessage(error.response.data);
      }
      return;
    }
  };

  const GetReturnItemListBySuppCode = async (suppCode: string) => {
    if (!suppCode || suppCode.trim() === "") {
      Alert.alert("Invalid Input", "Please enter supplier Code.");
      return;
    }
    try {
      const response = await getAllReturnItemsBySuppCode(suppCode);
      if (response.data !== "") {
        setReturnItems(response.data);
      }
    } catch (error: any) {
      if (error.response) {
        setmessage(error.response.data);
      }
      return;
    }
  };

  const ConfirmReturnItem = (id: any) => {
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

  const AddReturnItem = async (id: any) => {
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
      setmessage("Return item added successfully");
    } catch (error: any) {
      if (error.response) {
        setmessage(error.response.data);
      }
      return;
    }
  };

  const handleSuppDesChange = (text: string) => {
    setSuppCode(text);
    if (text.length > 0) {
      SearchBySuppDes(text);
    } else {
      setSuppSuggestions([]);
    }
  };

  const SearchBySuppDes = async (query: string) => {
    try {
      const response = await apigetSuppByDescription(query);
      setSuppSuggestions(response.data);
    } catch (error: any) {
      if (error.response) {
        setmessage(error.response.data);
      }
      return;
    }
  };

  const GetSupplier = (suggestion: any) => {
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
    //setReturnItems([]);
    setSupplier({});
    setSuppCode("");
    setSuppSuggestions([]);
    lastScannedRef.current = null;
    setmessage("");
  };

  const clearAllForm = () => {
    setReturnItems([]);
    clearForm();
  };

  const handleScan = (scannedData: string) => {
    if (scannedData === lastScannedRef.current) {
      setmessage("Same barcode scanned consecutively. Ignoring.");
      return;
    }
    lastScannedRef.current = scannedData;
    setBarcode(scannedData);
    setmessage(scannedData);
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
    try {
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
              setmessage("Selected items have been marked as returned");
            },
          },
        ]
      );
    } catch (error: any) {
      if (error.response) {
        setmessage(error.response.data);
      }
      return;
    }
  };

  const ProcessSelectedItems = async () => {
    try {
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
              setmessage("All items with status returned have been processed.");

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
    } catch (error: any) {
      if (error.response) {
        setmessage(error.response.data);
      }
      return;
    }
  };

  const DeleteItems = async () => {
    try {
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
              setmessage("Selected items have been deleted.");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      if (error.response) {
        setmessage(error.response.data);
      }
      return;
    }
  };

  const printProcessedData = async (items: any) => {
    try {
      if (items.length === 0) {
        Alert.alert("No items to print", "There are no items.");
        return;
      }
      await apiPrint(items);
      setmessage("Print request has been sent successfully.");
    } catch (error: any) {
      if (error.response) {
        setmessage(error.response.data);
      }
      return;
    }
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
    message,
    clearAllForm,
  };
};

export default useReturnPageLogic;
