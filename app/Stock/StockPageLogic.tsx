import { useState, useRef, useEffect } from "react";
import {
  apigetStockByItemCode,
  updateStock,
  apigetItemWithDetailsByBarcode,
  apigetItemByDescription,
  getPriceLink,
  apigetPosStockByItemCode,
  deleteAllPosCountedStock,
  deletePosCountedStockByItemCode,
} from "../../api.js";
import { Alert } from "react-native";

const useStockPageLogic = () => {
  const [barcode, setBarcode] = useState("");
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
  const [isOn, setIsOn] = useState(false);
  const [totalStock, setTotalStock] = useState("");
  const [message, setmessage] = useState("");
  const lastScannedRef = useRef<string | null>(null);

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

  useEffect(() => {
    if (isOn) {
      setTotalStock(
        (parseFloat(addOpStock || "0") + parseFloat(posStock || "0")).toString()
      );
    } else {
      setTotalStock(addOpStock || "0");
    }
  }, [addOpStock, posStock, isOn]);

  const handleScan = (scannedData: string) => {
    if (scannedData === lastScannedRef.current) {
      setmessage("Same barcode scanned consecutively. Ignoring.");
      return;
    }
    lastScannedRef.current = scannedData;
    setBarcode(scannedData);
    setmessage(scannedData);
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

          fetchStock(data.item_Code);
          fetchPosStock(data.item_Code);
          fetchPriceLink(data.item_Code);
        }
      }
    } catch (error: any) {
      clearForm();
      setmessage(error.response.data);
    }
  };

  const fetchPriceLink = async (itemCode: string) => {
    try {
      const response = await getPriceLink(itemCode);
      setPriceLink(response.data.map((pl) => pl.price).join(", "));
    } catch (error: any) {
      setmessage(error.response.data);
    }
  };

  const fetchStock = async (itemCode: string) => {
    try {
      const response = await apigetStockByItemCode(itemCode);
      setStock(response.data.stock);
    } catch (error: any) {
      setmessage(error.response.data);
    }
  };

  const fetchPosStock = async (itemCode: string) => {
    try {
      const response = await apigetPosStockByItemCode(itemCode);
      setPosStock(response.data);
    } catch (error: any) {
      setmessage(error.response.data);
    }
  };

  const handleUpdateStock = async (id) => {
    try {
      const response = await updateStock({
        Id: id,
        Stock: parseFloat(totalStock),
        item: items,
        CountedStock: isOn ? parseFloat(posStock) : 0,
      });
      console.log("Update Stock Response:", response.data);
      fetchStock(itemCode);

      setAddOpStock("");
      setTotalStock("");
      setPosStock("0");

      setmessage(response.data);
    } catch (error: any) {
      setmessage(error.response.data);
    }
  };

  const validateStockInput = (input: string) => {
    const regex = /^[0-9]*\.?[0-9]+$/;
    return regex.test(input);
  };

  const confirmUpdateStock = (id) => {
    if (validateStockInput(totalStock)) {
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
    setTotalStock("");
    setSuggestions([]);
    setPriceLink("");
    setPosStock("");
    lastScannedRef.current = null;
    //setmessage("");
  };

  const searchDescriptions = async (query: string) => {
    try {
      try {
        const response = await apigetItemByDescription(query);
        setSuggestions(response.data);
      } catch (error: any) {
        Alert.alert("Error", error.response.data);
      }
    } catch (error: any) {
      setmessage(error.response.data);
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (text.length > 0) {
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

  const toggleOnOff = () => {
    setIsOn((prevState) => !prevState);
    updateTotalStockss();
  };

  const updateTotalStock = (newAddOpStock) => {
    if (isOn) {
      setTotalStock(
        (parseFloat(newAddOpStock) + parseFloat(posStock)).toString()
      );
    } else {
      setTotalStock(parseFloat(newAddOpStock).toString());
    }
  };

  const updateTotalStockss = () => {
    if (isOn) {
      setTotalStock((parseFloat(addOpStock) + parseFloat(posStock)).toString());
    } else {
      setTotalStock(parseFloat(addOpStock).toString());
    }
  };

  function confirmFlushData() {
    Alert.alert(
      "Confirmation",
      "Do you want to Flush the data?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => handleFlushData() },
      ],
      { cancelable: false }
    );
  }

  async function handleFlushData() {
    try {
      const response = await deleteAllPosCountedStock();
      setmessage("Data flushed successfully!");
      clearForm();
    } catch (error: any) {
      setmessage(error.response.data);
    }
  }

  function confirmFlushItem(item_Code: string) {
    Alert.alert(
      "Confirmation",
      "Do you want to Flush the Item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => handleFlushItem(item_Code) },
      ],
      { cancelable: false }
    );
  }

  async function handleFlushItem(item_Code: string) {
    try {
      const response = await deletePosCountedStockByItemCode(item_Code);
      setmessage("Item flushed successfully!");
      clearForm();
    } catch (error: any) {
      setmessage(error.response.data);
    }
  }

  return {
    barcode,
    setBarcode,
    items,
    setItems,
    itemCode,
    setItemCode,
    refCode,
    setRefCode,
    description,
    setDescription,
    stock,
    setStock,
    addOpStock,
    setAddOpStock,
    suggestions,
    setSuggestions,
    inputRef,
    _priceLink,
    setPriceLink,
    modalVisible,
    setModalVisible,
    posStock,
    setPosStock,
    inputRef2,
    isOn,
    setIsOn,
    totalStock,
    setTotalStock,
    handleScan,
    fetchItemDetails,
    fetchPriceLink,
    fetchStock,
    fetchPosStock,
    handleUpdateStock,
    validateStockInput,
    confirmUpdateStock,
    clearForm,
    searchDescriptions,
    handleDescriptionChange,
    handleSuggestionPress,
    toggleOnOff,
    updateTotalStock,
    updateTotalStockss,
    confirmFlushData,
    handleFlushData,
    confirmFlushItem,
    handleFlushItem,
    message,
    setmessage,
    // lastScannedRef,
  };
};

export default useStockPageLogic;
