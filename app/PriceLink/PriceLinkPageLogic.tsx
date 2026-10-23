import { useState, useRef } from "react";
import { Alert } from "react-native";
import {
  plSearchByCode,
  plGetLinks,
  plAddLink,
  plDeleteLink,
  plUpdateRetailPrice,
  apiSearchItemzByDes,
} from "../../api";

// Price Link on the NEW system (api/Itemz): the same links as the back office Item Entry "Price Links" card.
// A price link = one more retail price for the same item (e.g. old stock at the old MRP). The till shows
// the normal price plus every link and the cashier picks one. Delete = the link is switched off (Status 0),
// tills drop it on their next download.

export interface PlItem {
  itemId: number; barcode?: string | null; refCode?: string | null; descrip?: string | null;
  retailPrice?: number | null; costPrice?: number | null; wholesalePrice?: number | null; maxPrice?: number | null;
}
export interface PlLink {
  priceLinkId: number; retailPrice: number; wholesalePrice?: number | null; costPrice?: number | null;
  remark?: string | null; cDate?: string;
}

const errText = (e: any, fb: string) =>
  e?.response?.data?.message || (typeof e?.response?.data === "string" ? e.response.data : "") || e?.message || fb;

export const money = (n?: number | null) => (n == null ? "" : Number(n).toFixed(2));
const toNum = (s: string) => (s.trim() === "" ? null : parseFloat(s));

const usePriceLinkPageLogic = () => {
  const [code, setCode] = useState("");
  const [item, setItem] = useState<PlItem | null>(null);
  const [choices, setChoices] = useState<PlItem[]>([]);
  const [descModal, setDescModal] = useState(false);
  const [descResults, setDescResults] = useState<any[]>([]);
  const [cameraOn, setCameraOn] = useState(true);

  const [retPrice, setRetPrice] = useState("");
  const [links, setLinks] = useState<PlLink[]>([]);
  const [newPrice, setNewPrice] = useState("");
  const [newRemark, setNewRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const newPriceRef = useRef<any>(null);
  const msgTimer = useRef<any>(null);
  const lastScannedRef = useRef<string | null>(null);

  const say = (text: string, ok = true) => {
    setMessage({ text, ok });
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMessage(null), ok ? 4000 : 8000);
  };

  const loadLinks = async (itemId: number) => {
    setLoading(true);
    try {
      const res = await plGetLinks(itemId);
      setLinks(res.data || []);
    } catch (e) {
      setLinks([]);
      say(errText(e, "Could not load the price links"), false);
    } finally {
      setLoading(false);
    }
  };

  const pickItem = (it: PlItem) => {
    setItem(it);
    setChoices([]);
    setCode("");
    setRetPrice(money(it.retailPrice));
    setNewPrice("");
    setNewRemark("");
    loadLinks(it.itemId);
  };

  const lookup = async (value: string) => {
    const v = (value || "").trim();
    if (!v) return;
    try {
      const res = await plSearchByCode(v);
      const list: PlItem[] = res.data || [];
      if (list.length === 0) say(`No item for ${v}`, false);
      else if (list.length === 1) pickItem(list[0]);
      else setChoices(list);
    } catch (e) {
      say(errText(e, "Item lookup failed"), false);
    }
  };

  // camera: the same barcode again is ignored (the camera reads it many times)
  const handleScan = (data: string) => {
    if (data === lastScannedRef.current && item) return;
    lastScannedRef.current = data;
    lookup(data);
  };

  const searchByDescription = async (text: string) => {
    if (text.trim().length < 3) { setDescResults([]); return; }
    try {
      const res = await apiSearchItemzByDes(text.trim());
      setDescResults((res.data || []).slice(0, 40));
    } catch {
      setDescResults([]);
    }
  };

  const pickDescription = (it: PlItem) => {
    setDescModal(false);
    setDescResults([]);
    pickItem(it);
  };

  // ---- the item's normal retail price ----
  const saveRetailPrice = async () => {
    if (!item) return;
    const p = toNum(retPrice);
    if (p == null || isNaN(p) || p <= 0) { say("Retail price must be more than 0", false); return; }
    if (Math.abs(p - (item.retailPrice ?? 0)) < 0.005) { say("The price is not changed"); return; }
    setBusy(true);
    try {
      await plUpdateRetailPrice(item.itemId, Math.round(p * 100) / 100);
      setItem({ ...item, retailPrice: p });
      setRetPrice(money(p));
      say(`Retail price saved: ${money(p)}`);
    } catch (e) {
      say(errText(e, "Price not saved"), false);
    } finally {
      setBusy(false);
    }
  };

  // ---- price links ----
  const addLink = async () => {
    if (!item) return;
    const p = toNum(newPrice);
    if (p == null || isNaN(p) || p <= 0) { say("Enter the link price", false); newPriceRef.current?.focus?.(); return; }
    if (Math.abs(p - (item.retailPrice ?? 0)) < 0.005) { say("This is already the item's normal retail price", false); return; }
    setBusy(true);
    try {
      await plAddLink({
        itemId: item.itemId,
        retailPrice: Math.round(p * 100) / 100,
        remark: newRemark.trim() ? newRemark.trim().slice(0, 50) : null,
      });
      say(`Price link ${money(p)} added`);
      setNewPrice("");
      setNewRemark("");
      loadLinks(item.itemId);
    } catch (e) {
      say(errText(e, "Price link not added"), false);
    } finally {
      setBusy(false);
    }
  };

  const deleteLink = (l: PlLink) => {
    if (!item) return;
    Alert.alert("Delete price link", `Delete the price ${money(l.retailPrice)} of ${item.descrip}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          setBusy(true);
          try {
            await plDeleteLink(l.priceLinkId);
            say(`Price link ${money(l.retailPrice)} deleted`);
            loadLinks(item.itemId);
          } catch (e) {
            say(errText(e, "Price link not deleted"), false);
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  };

  const clearForm = () => {
    setItem(null);
    setChoices([]);
    setCode("");
    setRetPrice("");
    setLinks([]);
    setNewPrice("");
    setNewRemark("");
    lastScannedRef.current = null;
    setMessage(null);
  };

  return {
    code, setCode, item, choices, setChoices, lookup, handleScan, pickItem, cameraOn, setCameraOn,
    descModal, setDescModal, descResults, searchByDescription, pickDescription,
    retPrice, setRetPrice, saveRetailPrice,
    links, loading, newPrice, setNewPrice, newRemark, setNewRemark, newPriceRef, addLink, deleteLink,
    clearForm, busy, message,
  };
};

export default usePriceLinkPageLogic;
