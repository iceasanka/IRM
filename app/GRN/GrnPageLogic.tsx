import { useState, useRef, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  plSearchByCode,
  plGetLinks,
  apiSearchItemzByDes,
  apiSearchSupplierz,
  stBalance,
  mgGet,
  mgAddLine,
  mgUpdateLine,
  mgDeleteLine,
} from "../../api.js";

// GRN on the NEW system: the phone scans a delivery into a SUSPENDED GRN of the supplier (one open draft per
// supplier, GRN no from the same counter as the back office). Nothing goes into stock here - the back office opens
// the GRN on the GRN Entry page, checks it, adds the supplier's invoice no and commits it to stock.
// Same item at the same cost + selling price again -> the qty is added to that line.

export interface Supplier { suppId: number; suppCode: string; suppName: string }
export interface GrnItem {
  itemId: number; barcode?: string | null; refCode?: string | null; descrip?: string | null;
  retailPrice?: number | null; costPrice?: number | null;
}
export interface GrnLine {
  grnNo: string; idx: number; itemId: number; barcode?: string | null; refCode?: string | null; descrip?: string | null;
  qty: number; costPrice: number; sellPrice: number; gAmount: number;
  itemCostPrice?: number | null; itemRetailPrice?: number | null; stockQty: number;
}

const SUPP_KEY = "grn_supplier";
const errText = (e: any, fb: string) =>
  e?.response?.data?.message || (typeof e?.response?.data === "string" ? e.response.data : "") || e?.message || fb;
const num = (s: string) => (s.trim() === "" ? NaN : parseFloat(s));
export const money = (n?: number | null) => (n == null ? "" : Number(n).toFixed(2));
export const qtyText = (q?: number | null) => (q == null ? "" : String(Number(Number(q).toFixed(3))));

const useGrnPageLogic = () => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [suppModal, setSuppModal] = useState(false);
  const [suppResults, setSuppResults] = useState<Supplier[]>([]);

  const [code, setCode] = useState("");
  const [item, setItem] = useState<GrnItem | null>(null);
  const [choices, setChoices] = useState<GrnItem[]>([]);
  const [descModal, setDescModal] = useState(false);
  const [descResults, setDescResults] = useState<any[]>([]);
  const [cameraOn, setCameraOn] = useState(true);
  const [stock, setStock] = useState<number | null>(null);
  const [links, setLinks] = useState<number[]>([]);

  const [cost, setCost] = useState("");
  const [sell, setSell] = useState("");
  const [qty, setQty] = useState("1");

  const [lines, setLines] = useState<GrnLine[]>([]);
  const [editLine, setEditLine] = useState<GrnLine | null>(null);
  const [edit, setEdit] = useState({ qty: "", cost: "", sell: "" });
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const qtyRef = useRef<any>(null);
  const msgTimer = useRef<any>(null);

  const say = (text: string, ok = true) => {
    setMessage({ text, ok });
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMessage(null), ok ? 4000 : 8000);
  };

  // the supplier used last time
  useEffect(() => {
    AsyncStorage.getItem(SUPP_KEY).then((s) => { if (s) { try { setSupplier(JSON.parse(s)); } catch { /* */ } } });
    return () => { if (msgTimer.current) clearTimeout(msgTimer.current); };
  }, []);

  const loadLines = useCallback(async (s: Supplier | null = supplier) => {
    if (!s) { setLines([]); return; }
    setLoading(true);
    try {
      const res = await mgGet(s.suppId);
      setLines(res.data || []);
    } catch (e) {
      say(errText(e, "Could not load the GRN"), false);
    } finally {
      setLoading(false);
    }
  }, [supplier]);

  useEffect(() => { loadLines(supplier); }, [supplier]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- supplier ----
  const searchSupplier = async (text: string) => {
    if (text.trim().length < 1) { setSuppResults([]); return; }
    try {
      const res = await apiSearchSupplierz(text.trim());
      setSuppResults((res.data || []).filter((s: any) => s.status !== 0));
    } catch {
      setSuppResults([]);
    }
  };

  const pickSupplier = (s: Supplier) => {
    const v = { suppId: s.suppId, suppCode: s.suppCode, suppName: s.suppName };
    setSupplier(v);
    setSuppModal(false);
    setSuppResults([]);
    AsyncStorage.setItem(SUPP_KEY, JSON.stringify(v));
  };

  // ---- item ----
  const pickItem = (it: GrnItem) => {
    setItem(it);
    setChoices([]);
    setCode("");
    setCost(money(it.costPrice));
    setSell(money(it.retailPrice));
    setQty("1");
    setStock(null);
    setLinks([]);
    stBalance(it.itemId).then((r: any) => setStock(r.data?.qty ?? 0)).catch(() => setStock(null));
    plGetLinks(it.itemId).then((r: any) => setLinks((r.data || []).map((l: any) => l.retailPrice))).catch(() => setLinks([]));
    setTimeout(() => qtyRef.current?.focus?.(), 200);
  };

  const lookup = async (value: string) => {
    const v = (value || "").trim();
    if (!v) return;
    try {
      const res = await plSearchByCode(v);
      const list: GrnItem[] = res.data || [];
      if (list.length === 0) say(`No item for ${v}`, false);
      else if (list.length === 1) pickItem(list[0]);
      else setChoices(list);
    } catch (e) {
      say(errText(e, "Item lookup failed"), false);
    }
  };

  // camera: the same item again -> ask before adding one more (the camera keeps seeing the barcode, so no second
  // question while one is open, and a short pause after it is answered)
  const askingRef = useRef(false);
  const handleScan = (data: string) => {
    if (item && (data === item.barcode || data === item.refCode)) {
      if (askingRef.current) return;
      askingRef.current = true;
      const done = () => setTimeout(() => { askingRef.current = false; }, 2000);
      const next = (parseFloat(qty) || 0) + 1;
      Alert.alert("Same item", `${item.descrip} is already scanned (qty ${qtyText(parseFloat(qty) || 0)}). Add one more?`, [
        { text: "No", style: "cancel", onPress: done },
        { text: `Add (qty ${qtyText(next)})`, onPress: () => { setQty((q) => String((parseFloat(q) || 0) + 1)); say(`Qty ${qtyText(next)}`); done(); } },
      ], { cancelable: true, onDismiss: done });
      return;
    }
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

  const pickDescription = (it: GrnItem) => {
    setDescModal(false);
    setDescResults([]);
    pickItem(it);
  };

  const changeQty = (d: number) => setQty((q) => String(Math.max(1, (parseFloat(q) || 0) + d)));

  const clearItem = () => { setItem(null); setChoices([]); setCode(""); setQty("1"); setCost(""); setSell(""); setStock(null); setLinks([]); };

  const addLine = async () => {
    if (!supplier) { Alert.alert("Supplier", "Select the supplier first."); return; }
    if (!item) { say("Scan an item first", false); return; }
    const q = num(qty), c = num(cost), p = num(sell);
    if (!(q > 0)) { say("Enter a qty more than 0", false); return; }
    if (isNaN(c) || c < 0) { say("Enter the cost price", false); return; }
    if (isNaN(p) || p < 0) { say("Enter the selling price", false); return; }
    if (p > 0 && c > p) {
      Alert.alert("Check the prices", `The cost ${money(c)} is more than the selling price ${money(p)}.`, [
        { text: "Change", style: "cancel" },
        { text: "Add anyway", onPress: () => sendLine(q, c, p) },
      ]);
      return;
    }
    sendLine(q, c, p);
  };

  const sendLine = async (q: number, c: number, p: number) => {
    if (!supplier || !item) return;
    setBusy(true);
    try {
      const res = await mgAddLine({ suppId: supplier.suppId, itemId: item.itemId, qty: q, costPrice: c, sellPrice: p });
      say(`${item.descrip} x ${qtyText(q)} added to ${res.data?.grnNo}`);
      clearItem();
      loadLines();
    } catch (e) {
      say(errText(e, "Not added"), false);
    } finally {
      setBusy(false);
    }
  };

  // ---- lines ----
  const openLine = (l: GrnLine) => {
    setEditLine(l);
    setEdit({ qty: qtyText(l.qty), cost: money(l.costPrice), sell: money(l.sellPrice) });
  };

  const saveLine = async () => {
    if (!editLine) return;
    const q = num(edit.qty), c = num(edit.cost), p = num(edit.sell);
    if (!(q > 0) || isNaN(c) || c < 0 || isNaN(p) || p < 0) { Alert.alert("Check", "Enter the qty, cost and selling price."); return; }
    setBusy(true);
    try {
      await mgUpdateLine(editLine.idx, { qty: q, costPrice: c, sellPrice: p });
      say("Line saved");
      setEditLine(null);
      loadLines();
    } catch (e) {
      Alert.alert("Not saved", errText(e, "Not saved"));
    } finally {
      setBusy(false);
    }
  };

  const deleteLine = () => {
    if (!editLine) return;
    const l = editLine;
    Alert.alert("Delete", `Delete ${l.descrip} x ${qtyText(l.qty)} from the GRN?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          setBusy(true);
          try {
            const res = await mgDeleteLine(l.idx);
            say(res.data?.linesLeft === 0 ? `${l.descrip} deleted - the GRN was empty, so it was deleted too` : `${l.descrip} deleted`);
            setEditLine(null);
            loadLines();
          } catch (e) {
            Alert.alert("Not deleted", errText(e, "Not deleted"));
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  };

  const grnNo = lines[0]?.grnNo ?? null;
  const total = lines.reduce((a, l) => a + (l.gAmount || 0), 0);
  const totalQty = lines.reduce((a, l) => a + (l.qty || 0), 0);

  return {
    supplier, suppModal, setSuppModal, suppResults, searchSupplier, pickSupplier,
    code, setCode, item, choices, setChoices, lookup, handleScan, pickItem, clearItem, cameraOn, setCameraOn,
    descModal, setDescModal, descResults, searchByDescription, pickDescription, stock, links,
    cost, setCost, sell, setSell, qty, setQty, changeQty, qtyRef, addLine,
    lines, grnNo, total, totalQty, loadLines, loading, busy,
    editLine, setEditLine, edit, setEdit, openLine, saveLine, deleteLine, message,
  };
};

export default useGrnPageLogic;
