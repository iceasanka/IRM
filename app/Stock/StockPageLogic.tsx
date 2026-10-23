import { useState, useRef, useEffect } from "react";
import { Alert } from "react-native";
import {
  plSearchByCode,
  plGetLinks,
  apiSearchItemzByDes,
  stBalance,
  stItemCard,
  stReasons,
  stAdjust,
  syncTerminals,
} from "../../api.js";

// Stock on the NEW system (stock ledger). Till bills reach the back office by themselves about every minute, so the
// stock shown is already after the sales - no POS stock, no "with / without POS", no flush any more.
// Set = the counted qty becomes the stock (count mode), Add / Remove = + / - qty. Each save is a stock adjustment
// (ADJ no), posted at once, seen on the back office Stock Adjustment page.

export interface StItem {
  itemId: number; barcode?: string | null; refCode?: string | null; descrip?: string | null;
  retailPrice?: number | null; costPrice?: number | null; maxPrice?: number | null;
  discountAmount?: number | null; discountPercent?: number | null;
}
export interface StMove { ledgerId: number; txnDate: string; txnTypeName: string; docNo: string; qtyIn: number; qtyOut: number; balance: number }
export interface Till { terminalCode: string; terminalName?: string | null; status: number; lastSyncAt?: string | null; isStale: boolean }
export type Mode = "set" | "add" | "remove";

const errText = (e: any, fb: string) =>
  e?.response?.data?.message || (typeof e?.response?.data === "string" ? e.response.data : "") || e?.message || fb;

export const money = (n?: number | null) => (n == null ? "" : Number(n).toFixed(2));
export const qtyText = (q?: number | null) => (q == null ? "" : String(Number(Number(q).toFixed(3))));

// "3 min ago" / "2 h ago" / "4 days ago"
export const timeAgo = (s?: string | null) => {
  if (!s) return "never";
  const t = new Date(s).getTime();
  if (isNaN(t)) return "";
  const min = Math.round((Date.now() - t) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  if (min < 48 * 60) return `${Math.round(min / 60)} h ago`;
  return `${Math.round(min / 1440)} days ago`;
};

const DEFAULT_REASON: Record<Mode, string> = { set: "Stock count", add: "Stock count", remove: "Damaged" };

const useStockPageLogic = () => {
  const [code, setCode] = useState("");
  const [item, setItem] = useState<StItem | null>(null);
  const [choices, setChoices] = useState<StItem[]>([]);
  const [descModal, setDescModal] = useState(false);
  const [descResults, setDescResults] = useState<any[]>([]);
  const [cameraOn, setCameraOn] = useState(true);

  const [stock, setStock] = useState<number | null>(null);
  const [avgCost, setAvgCost] = useState<number | null>(null);
  const [links, setLinks] = useState<number[]>([]);
  const [moves, setMoves] = useState<StMove[]>([]);
  const [tills, setTills] = useState<Till[] | null>([]);
  const [reasons, setReasons] = useState<{ reasonId: number; reasonName: string }[]>([]);

  const [mode, setModeState] = useState<Mode>("set");
  const [qty, setQty] = useState("");
  const [reasonId, setReasonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const qtyRef = useRef<any>(null);
  const msgTimer = useRef<any>(null);
  const lastScannedRef = useRef<string | null>(null);

  const say = (text: string, ok = true) => {
    setMessage({ text, ok });
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMessage(null), ok ? 5000 : 9000);
  };

  const reasonByName = (list: { reasonId: number; reasonName: string }[], name: string) =>
    list.find((r) => r.reasonName.toLowerCase() === name.toLowerCase())?.reasonId ?? list[0]?.reasonId ?? null;

  // null = the server did not answer
  const loadTills = async () => {
    try {
      const res = await syncTerminals();
      setTills((res.data || []).filter((t: Till) => t.status === 1));
    } catch {
      setTills(null);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await stReasons();
        const list = (res.data || []).filter((r: any) => r.status !== 0);
        setReasons(list);
        setReasonId(reasonByName(list, DEFAULT_REASON.set));
      } catch { /* the save still works with the default reason */ }
    })();
    loadTills();
    const t = setInterval(loadTills, 60000);
    return () => { clearInterval(t); if (msgTimer.current) clearTimeout(msgTimer.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setMode = (m: Mode) => {
    setModeState(m);
    setReasonId(reasonByName(reasons, DEFAULT_REASON[m]));
  };

  // stock + last 30 days of movements (newest first)
  const loadStock = async (itemId: number) => {
    setLoading(true);
    try {
      const from = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
      const [bal, card] = await Promise.all([
        stBalance(itemId).catch(() => null),
        stItemCard(itemId, from).catch(() => null),
      ]);
      setStock(bal?.data?.qty ?? 0);
      setAvgCost(bal?.data?.avgCost ?? null);
      setMoves(((card?.data?.rows || []) as StMove[]).slice().reverse().slice(0, 8));
    } finally {
      setLoading(false);
    }
  };

  const pickItem = (it: StItem) => {
    setItem(it);
    setChoices([]);
    setCode("");
    setQty("");
    setStock(null);
    setMoves([]);
    setLinks([]);
    loadStock(it.itemId);
    plGetLinks(it.itemId).then((r: any) => setLinks((r.data || []).map((l: any) => l.retailPrice))).catch(() => setLinks([]));
    loadTills();
    setTimeout(() => qtyRef.current?.focus?.(), 250);
  };

  const lookup = async (value: string) => {
    const v = (value || "").trim();
    if (!v) return;
    try {
      const res = await plSearchByCode(v);
      const list: StItem[] = res.data || [];
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

  const pickDescription = (it: StItem) => {
    setDescModal(false);
    setDescResults([]);
    pickItem(it);
  };

  const staleTills = (tills || []).filter((t) => t.isStale);
  const q = parseFloat(qty);
  const qtyOk = !isNaN(q) && (mode === "set" ? q >= 0 : q > 0);
  const newStock = !qtyOk || stock == null ? null : mode === "set" ? q : mode === "add" ? stock + q : stock - q;

  const save = () => {
    if (!item) return;
    if (!qtyOk) { say(mode === "set" ? "Enter the counted qty" : "Enter a qty more than 0", false); qtyRef.current?.focus?.(); return; }
    const reason = reasons.find((r) => r.reasonId === reasonId)?.reasonName ?? "";
    const what = mode === "set" ? `Set the stock to ${qtyText(q)}` : mode === "add" ? `Add ${qtyText(q)}` : `Remove ${qtyText(q)}`;
    let text = `${item.descrip}\n${what} (${reason}).\nStock ${qtyText(stock)} -> ${qtyText(newStock)}`;
    if (mode === "set" && staleTills.length > 0)
      text += `\n\nWarning: ${staleTills.map((t) => t.terminalCode).join(", ")} has not sent its bills for a while. ` +
        "Its sales of this item will be taken off again when they arrive - the stock may end up too low.";
    Alert.alert("Save stock", text, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save", onPress: async () => {
          setBusy(true);
          try {
            const res = await stAdjust(item.itemId, {
              countedQty: mode === "set" ? q : null,
              adjQty: mode === "set" ? null : mode === "add" ? q : -q,
              reasonId: reasonId ?? 1,
            });
            say(res.data?.message || "Stock saved");
            setQty("");
            loadStock(item.itemId);
          } catch (e) {
            say(errText(e, "Stock not saved"), false);
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
    setQty("");
    setStock(null);
    setMoves([]);
    setLinks([]);
    lastScannedRef.current = null;
    setMessage(null);
  };

  return {
    code, setCode, item, choices, setChoices, lookup, handleScan, pickItem, cameraOn, setCameraOn,
    descModal, setDescModal, descResults, searchByDescription, pickDescription,
    stock, avgCost, links, moves, tills, staleTills, loadTills, reasons, loading,
    mode, setMode, qty, setQty, qtyRef, reasonId, setReasonId, newStock, save, busy,
    clearForm, message,
  };
};

export default useStockPageLogic;
