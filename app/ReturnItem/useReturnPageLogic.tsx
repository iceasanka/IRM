import { useState, useEffect, useRef, useCallback } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  rlLookup,
  rlList,
  rlAdd,
  rlSetStatus,
  rlDelete,
  rlProcess,
  rlPrint,
  apiSearchSupplierz,
  apiSearchItemzByDes,
} from "../../api.js";

// Return Stock on the NEW system (api/ReturnList): the same list as the back office Return Items page.
// Pick the supplier, scan items (scanning the same item again = qty + 1), Add. Then select rows:
// Ready = checked / packed, Process = a PRN of the Ready rows, taken off stock at once.

export interface Supplier { suppId: number; suppCode: string; suppName: string }
export interface LookupItem {
  itemId: number; barcode?: string | null; refCode?: string | null; descrip?: string | null;
  costPrice?: number | null; retailPrice?: number | null; stockQty: number; suppId?: number | null;
}
export interface ReturnRow {
  returnId: number; itemId: number; barcode?: string | null; refCode?: string | null; descrip?: string | null;
  suppId: number; suppName?: string | null; qty: number; costPrice?: number | null; amount: number; stockQty: number;
  reason?: string | null; status: number; statusText: string; source: number;
}

export const REASONS = ["Damaged", "Expired", "Not selling", "Wrong item", "Other"];
const SUPP_KEY = "return_supplier";

const errText = (e: any, fb: string) => e?.response?.data?.message || (typeof e?.response?.data === "string" ? e.response.data : "") || e?.message || fb;

const useReturnPageLogic = () => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [suppModal, setSuppModal] = useState(false);
  const [suppResults, setSuppResults] = useState<Supplier[]>([]);

  const [code, setCode] = useState("");
  const [item, setItem] = useState<LookupItem | null>(null);
  const [choices, setChoices] = useState<LookupItem[]>([]);
  const [descModal, setDescModal] = useState(false);
  const [descResults, setDescResults] = useState<any[]>([]);
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState("Damaged");
  const [cameraOn, setCameraOn] = useState(true);

  const [rows, setRows] = useState<ReturnRow[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
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

  const loadList = useCallback(async (s: Supplier | null = supplier) => {
    if (!s) { setRows([]); return; }
    setLoading(true);
    try {
      const res = await rlList(s.suppId);
      const data: ReturnRow[] = res.data || [];
      setRows(data);
      setSelected((sel) => new Set([...sel].filter((id) => data.some((r) => r.returnId === id))));
    } catch (e) {
      say(errText(e, "Could not load the return list"), false);
    } finally {
      setLoading(false);
    }
  }, [supplier]);

  useEffect(() => { loadList(supplier); }, [supplier]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setSelected(new Set());
    AsyncStorage.setItem(SUPP_KEY, JSON.stringify(v));
  };

  // ---- item ----
  const pickItem = (it: LookupItem) => {
    setItem(it);
    setChoices([]);
    setQty("1");
    setCode("");
    setTimeout(() => qtyRef.current?.focus?.(), 150);
  };

  const lookup = async (value: string) => {
    const v = (value || "").trim();
    if (!v) return;
    try {
      const res = await rlLookup(v);
      const list: LookupItem[] = res.data || [];
      if (list.length === 0) say(`No item for ${v}`, false);
      else if (list.length === 1) pickItem(list[0]);
      else setChoices(list);
    } catch (e) {
      say(errText(e, "Item lookup failed"), false);
    }
  };

  // camera: the same item again = one more
  const handleScan = (data: string) => {
    if (item && (data === item.barcode || data === item.refCode)) {
      const next = (parseFloat(qty) || 0) + 1;
      setQty(String(next));
      say(`Same item again - qty ${next}`);
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

  const pickDescription = (it: any) => {
    setDescModal(false);
    setDescResults([]);
    lookup(it.barcode || it.refCode || String(it.itemId));
  };

  const changeQty = (d: number) => setQty((q) => String(Math.max(1, (parseFloat(q) || 0) + d)));

  const clearItem = () => { setItem(null); setChoices([]); setQty("1"); setCode(""); };

  const addItem = async () => {
    if (!supplier) { Alert.alert("Supplier", "Select the supplier first."); return; }
    if (!item) { say("Scan an item first", false); return; }
    const q = parseFloat(qty);
    if (!(q > 0)) { Alert.alert("Qty", "Enter a return qty more than 0."); return; }
    setBusy(true);
    try {
      await rlAdd({ itemId: item.itemId, suppId: supplier.suppId, qty: q, reason });
      say(`${item.descrip} x ${q} added`);
      clearItem();
      loadList();
    } catch (e) {
      say(errText(e, "Not added"), false);
    } finally {
      setBusy(false);
    }
  };

  // ---- list ----
  const toggleSelect = (id: number) =>
    setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const selectAll = () =>
    setSelected((s) => (s.size === rows.length ? new Set() : new Set(rows.map((r) => r.returnId))));

  const selRows = rows.filter((r) => selected.has(r.returnId));

  const deleteSelected = () => {
    if (selRows.length === 0) { Alert.alert("Delete", "Select the items to delete."); return; }
    Alert.alert("Delete", `Delete ${selRows.length} item(s) from the return list?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          setBusy(true);
          try {
            const res = await rlDelete(selRows.map((r) => r.returnId));
            say(`${res.data?.deleted ?? 0} item(s) deleted`);
            setSelected(new Set());
            loadList();
          } catch (e) { say(errText(e, "Not deleted"), false); }
          finally { setBusy(false); }
        },
      },
    ]);
  };

  // all selected already Ready -> back to Added, else Ready
  const toggleReady = async () => {
    if (selRows.length === 0) { Alert.alert("Ready", "Select the items you have checked / packed."); return; }
    const status = selRows.every((r) => r.status === 2) ? 1 : 2;
    setBusy(true);
    try {
      const res = await rlSetStatus(selRows.map((r) => r.returnId), status);
      say(status === 2 ? `${res.data?.changed ?? 0} item(s) Ready` : `${res.data?.changed ?? 0} item(s) back to Added`);
      loadList();
    } catch (e) { say(errText(e, "Status not changed"), false); }
    finally { setBusy(false); }
  };

  // the selected Ready rows (none selected = every Ready row of this supplier) -> PRN, off stock now
  const processReady = () => {
    const ready = (selRows.length > 0 ? selRows : rows).filter((r) => r.status === 2);
    if (ready.length === 0) {
      Alert.alert("Process", "No Ready items. Select the items, press Ready, then Process.");
      return;
    }
    const amount = ready.reduce((a, r) => a + (r.amount || 0), 0);
    Alert.alert(
      "Process",
      `Make the PRN for ${ready.length} Ready item(s) of ${supplier?.suppName} (Rs ${amount.toFixed(2)}) and take them off stock?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Make PRN", onPress: async () => {
            setBusy(true);
            try {
              const ids = ready.map((r) => r.returnId);
              const res = await rlProcess(ids, true);
              say(`${res.data?.prnNo} made - ${res.data?.lines} line(s), off stock`);
              setSelected(new Set());
              loadList();
              Alert.alert("Print", "Print the return slip?", [
                { text: "No", style: "cancel" },
                {
                  text: "Print", onPress: async () => {
                    try { await rlPrint(ids); say("Return slip printed"); }
                    catch (e) { say(errText(e, "Not printed"), false); }
                  },
                },
              ]);
            } catch (e) {
              say(errText(e, "Not processed"), false);
            } finally {
              setBusy(false);
            }
          },
        },
      ]
    );
  };

  const total = rows.reduce((a, r) => a + (r.amount || 0), 0);
  const readyCount = rows.filter((r) => r.status === 2).length;

  return {
    supplier, suppModal, setSuppModal, suppResults, searchSupplier, pickSupplier,
    code, setCode, item, choices, setChoices, lookup, handleScan, pickItem, clearItem,
    descModal, setDescModal, descResults, searchByDescription, pickDescription,
    qty, setQty, changeQty, qtyRef, reason, setReason, addItem, cameraOn, setCameraOn,
    rows, selected, selRows, toggleSelect, selectAll, loadList, loading, busy,
    deleteSelected, toggleReady, processReady, total, readyCount, message,
  };
};

export default useReturnPageLogic;
