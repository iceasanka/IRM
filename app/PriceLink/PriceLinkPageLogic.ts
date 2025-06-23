import { useState, useEffect, useRef } from "react";
import {
  apigetItemWithDetailsByBarcode,
  getPriceLink,
  addPriceLink,
  updateItemRetPrice,
} from "../../api";

const usePriceLinkPageLogic = () => {
  const [barcode, setBarcode] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemDescrip, setItemDescrip] = useState("");
  const [costPrice, setCostPrice] = useState(0);
  const [packSize, setPackSize] = useState(1);
  const [priceLinks, setPriceLinks] = useState<{ price: number }[]>([]);
  const [newPrice, setNewPrice] = useState("");
  const inputRef = useRef(null);
  const [eRetPrice, seteRetPrice] = useState(0);
  const [message, setmessage] = useState("");
  const lastScannedRef = useRef<string | null>(null);

  useEffect(() => {
    if (barcode) {
      fetchItemDetails(barcode);
    }
    // eslint-disable-next-line
  }, [barcode]);

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
        setItemCode(data.item_Code);
        setItemDescrip(data.descrip);
        setCostPrice(data.cost_Price);
        seteRetPrice(data.eRet_Price);
        setPackSize(data.pack_Size);
        fetchPriceLinks(data.item_Code);
      } else {
        clearForm();
      }
    } catch (error: any) {
      if (error.response) {
        clearForm();
        setmessage(error.response.data);
      }
    }
  };

  const fetchPriceLinks = async (itemCode: string) => {
    try {
      const response = await getPriceLink(itemCode);
      setPriceLinks(response.data);
    } catch (error: any) {
      setmessage(error.response.data);
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
    } catch (error: any) {
      setmessage(error.response.data);
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
    } catch (error: any) {
      setmessage(error.response.data);
    }
  };

  const handleSaveRetPrice = async () => {
    try {
      await updateItemRetPrice(itemCode, eRetPrice);
      setmessage("Item Price updated successfully.");
    } catch (error: any) {
      setmessage(error.response.data);
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
    lastScannedRef.current = null;
    setmessage("");
  };

  return {
    barcode,
    setBarcode,
    itemCode,
    setItemCode,
    itemDescrip,
    setItemDescrip,
    costPrice,
    setCostPrice,
    packSize,
    setPackSize,
    priceLinks,
    setPriceLinks,
    newPrice,
    setNewPrice,
    inputRef,
    eRetPrice,
    seteRetPrice,
    handleScan,
    fetchItemDetails,
    fetchPriceLinks,
    handleDeletePriceLink,
    handleAddPriceLink,
    handleSaveRetPrice,
    clearForm,
    message,
  };
};

export default usePriceLinkPageLogic;
