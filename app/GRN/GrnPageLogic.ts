import { useState, useRef, useEffect } from "react";
import {
  apigetItemWithDetailsByBarcode,
  apiAddGrn,
  apiDeleteGrn,
  apigetSuppByDescription,
  apiGetGrnTempByGrnReferenceAndStatus,
  getPriceLink,
} from "../../api.js";
import { Alert } from "react-native";

const useGrnPageLogic = () => {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const itemRefInputRef = useRef(null);
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [gridData, setGridData] = useState<any[]>([]);
  const [formValues, setFormValues] = useState({
    ItemRefCode: "",
    CostPrice: "",
    ERetPrice: "",
    Qty: "",
  });
  const [_returnItems, setReturnItems] = useState<any[]>([]);
  const qtyInputRef = useRef(null);
  const itemRefCounter = useRef<number>(1);
  const [message, setmessage] = useState("");
  const [_suppmodalVisible, setsuppModalVisible] = useState(false);
  const [_suppSuggestions, setSuppSuggestions] = useState([]);
  const [_suppCode, setSuppCode] = useState("");
  const [_supplier, setSupplier] = useState({});
  const lastScannedRef = useRef<string | null>(null);
  const [priceLinks, setPriceLinks] = useState<{ price: number }[]>([]);

  useEffect(() => {
    if (barcode) {
      fetchItemDetails(barcode);
    }
  }, [barcode]);

  const fetchPriceLinks = async (itemCode: string) => {
    try {
      const response = await getPriceLink(itemCode);
      setPriceLinks(response.data);
    } catch (error: any) {
      setmessage(error.response.data);
    }
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

  const fetchItemDetails = async (barcode: string) => {
    try {
      const response = await apigetItemWithDetailsByBarcode(barcode);
      const data = response.data;
      if (data) {
        setItemDetails(data);
        setFormValues({
          ItemRefCode: itemRefCounter.current.toString(),
          CostPrice: "",
          ERetPrice: "",
          Qty: "",
        });
        setSuppCode(response.data.supp_Code);
        fetchPriceLinks(data.item_Code);
        setTimeout(() => {
          itemRefInputRef.current?.focus();
        }, 100);
      } else {
        clearForm();
      }
    } catch (error: any) {
      clearForm();
      setmessage(error.response.data);
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
      const _item = {
        ...added,
        selected: false,
      };
      setReturnItems((prevItems) => [...prevItems, _item]);
      itemRefCounter.current += 1;
      setmessage(_response.data.message);
      setItemDetails(null);
      clearForm();
    } catch (error: any) {
      setmessage(error.response.data);
    }
  };

  const toggleSelect = (id: number) => {
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
    lastScannedRef.current = null;
    setPriceLinks([]);
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

  function DeleteItems() {
    const selectedItems = _returnItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      Alert.alert("No items selected", "Please select items to delete.");
      return;
    }
    if (selectedItems.length > 1) {
      Alert.alert("Error", "Please select only one item to delete.");
      return;
    }
    Alert.alert("Delete", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          const _response = await apiDeleteGrn(selectedItems[0].id);
          const deleted = _response.data.data;
          if (deleted) {
            setmessage(_response.data.message);
            //Alert.alert("Success", _response.data.message);
            setReturnItems((prevItems) =>
              prevItems.filter((item) => !item.selected)
            );
          }
        },
      },
    ]);
  }

  async function GetGrnItemsByGrnRef(_suppCode: string) {
    try {
      if (!_suppCode || _suppCode.trim() === "") {
        Alert.alert("Invalid Input", "Please enter supplier Code.");
        return;
      }
      const response = await apiGetGrnTempByGrnReferenceAndStatus(_suppCode, 1);
      const data = response.data.data;
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
    } catch (error: any) {
      setmessage(error.response.data);
    }
  }

  const handleSuppDesChange = (text: string) => {
    try {
      setSuppCode(text);
      if (text.length > 0) {
        SearchBySuppDes(text);
      } else {
        setSuppSuggestions([]);
      }
    } catch (error: any) {
      setmessage(error.response.data);
    }
  };

  const SearchBySuppDes = async (query: any) => {
    try {
      const response = await apigetSuppByDescription(query);
      setSuppSuggestions(response.data);
    } catch (error: any) {
      setmessage(error.response.data);
    }
  };

  const GetSupplier = (suggestion: any) => {
    try {
      setSuppCode(suggestion.supp_Code);
      setSuppSuggestions([]);
      setsuppModalVisible(false);
      setSupplier(suggestion);
    } catch (error: any) {
      setmessage(error.response.data);
    }
  };

  return {
    barcode,
    setBarcode,
    scanning,
    setScanning,
    itemRefInputRef,
    itemDetails,
    gridData,
    setGridData,
    formValues,
    setFormValues,
    _returnItems,
    setReturnItems,
    qtyInputRef,
    itemRefCounter,
    message,
    setmessage,
    _suppmodalVisible,
    setsuppModalVisible,
    _suppSuggestions,
    setSuppSuggestions,
    _suppCode,
    setSuppCode,
    _supplier,
    setSupplier,
    lastScannedRef,
    priceLinks,
    setPriceLinks,
    handleScan,
    fetchItemDetails,
    saveTempGrn,
    toggleSelect,
    clearForm,
    clearAllForm,
    DeleteItems,
    GetGrnItemsByGrnRef,
    handleSuppDesChange,
    SearchBySuppDes,
    GetSupplier,
  };
};

export default useGrnPageLogic;
