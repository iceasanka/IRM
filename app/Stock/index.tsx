import React from "react";
import { Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScanBar, MessageLine, ItemPickers } from "../../components/ItemFinder";
import { C, common } from "../../theme";
import styles from "./StockPageStyles.js";
import useStockPageLogic, { money, qtyText, timeAgo, Mode } from "./StockPageLogic";

const MODES: { key: Mode; label: string }[] = [
  { key: "set", label: "Set (counted)" },
  { key: "add", label: "Add +" },
  { key: "remove", label: "Remove -" },
];

const fmtDate = (s: string) => {
  const d = new Date(s);
  return isNaN(d.getTime()) ? "" : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// Stock - scan an item, see its stock now (till sales already in), set / add / remove stock (new system)
const StockPage = () => {
  const logic = useStockPageLogic();
  const s = common;
  const it = logic.item;
  // keep the last fields above the Android navigation bar (the app draws edge to edge)
  const navBar = useSafeAreaInsets().bottom;
  const disc = it?.discountPercent ? `${qtyText(it.discountPercent)} %` : it?.discountAmount ? money(it.discountAmount) : "-";

  return (
    <KeyboardAvoidingView style={s.page} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={60}>
      {/* Tills: are their bills in? */}
      <TouchableOpacity style={[styles.tillBar, (logic.tills == null || logic.staleTills.length > 0) && styles.tillBarBad]} onPress={logic.loadTills} activeOpacity={0.8}>
        <Text style={styles.tillText} numberOfLines={2}>
          {logic.tills == null
            ? "No answer from the server"
            : logic.tills.length === 0
            ? "No tills registered"
            : logic.staleTills.length > 0
              ? `${logic.staleTills.map((t) => `${t.terminalCode} last sent ${timeAgo(t.lastSyncAt)}`).join(", ")} - its sales are not in the stock yet`
              : `Till sales are in the stock (${logic.tills.map((t) => `${t.terminalCode} ${timeAgo(t.lastSyncAt)}`).join(", ")})`}
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: 24 + navBar }]} keyboardShouldPersistTaps="handled">
        <ScanBar
          cameraOn={logic.cameraOn} setCameraOn={logic.setCameraOn} code={logic.code} setCode={logic.setCode}
          onScan={logic.handleScan} onFind={() => logic.lookup(logic.code)} onName={() => logic.setDescModal(true)}
        />
        <MessageLine message={logic.message} />

        {!it ? (
          <Text style={s.hint}>Scan or find an item to see its stock.</Text>
        ) : (
          <>
            {/* Item */}
            <View style={s.card}>
              <Text style={s.itemName}>{it.descrip}</Text>
              <Text style={s.itemCode}>{it.barcode} {it.refCode ? `· ${it.refCode}` : ""}</Text>
              <View style={s.infoRow}>
                <View style={s.infoCell}>
                  <Text style={s.infoLabel}>Price</Text>
                  <Text style={s.infoValue}>{money(it.retailPrice)}</Text>
                </View>
                <View style={s.infoCell}>
                  <Text style={s.infoLabel}>Discount</Text>
                  <Text style={s.infoValue}>{disc}</Text>
                </View>
                <View style={s.infoCell}>
                  <Text style={s.infoLabel}>Price links</Text>
                  <Text style={[s.infoValue, { color: C.green }]}>{logic.links.length ? logic.links.map(money).join(", ") : "-"}</Text>
                </View>
              </View>

              {/* Stock now */}
              <View style={styles.stockRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.infoLabel}>STOCK NOW</Text>
                  {logic.loading && logic.stock == null ? (
                    <ActivityIndicator color={C.primary} style={{ alignSelf: "flex-start", marginTop: 8 }} />
                  ) : (
                    <Text style={[styles.stockQty, (logic.stock ?? 0) < 0 ? { color: C.red } : (logic.stock ?? 0) === 0 ? { color: C.muted } : null]}>
                      {qtyText(logic.stock)}
                    </Text>
                  )}
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={s.infoLabel}>Avg cost</Text>
                  <Text style={s.infoValue}>{logic.avgCost != null ? money(logic.avgCost) : money(it.costPrice)}</Text>
                </View>
              </View>
            </View>

            {/* Set / add / remove */}
            <View style={s.card}>
              <View style={styles.modeRow}>
                {MODES.map((m) => (
                  <TouchableOpacity key={m.key} style={[styles.modeButton, logic.mode === m.key && styles.modeOn]} onPress={() => logic.setMode(m.key)}>
                    <Text style={[styles.modeText, logic.mode === m.key && styles.modeTextOn]}>{m.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[styles.qtyRow]}>
                <TextInput
                  ref={logic.qtyRef}
                  style={s.bigInput}
                  value={logic.qty}
                  onChangeText={logic.setQty}
                  keyboardType="decimal-pad"
                  placeholder={logic.mode === "set" ? "Counted" : "Qty"}
                  placeholderTextColor={C.muted}
                />
                <TouchableOpacity style={[s.bigButton, logic.busy && s.disabled]} onPress={logic.save} disabled={logic.busy}>
                  <Text style={s.bigButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
              {logic.newStock != null ? (
                <Text style={styles.preview}>
                  Stock {qtyText(logic.stock)} → <Text style={{ fontWeight: "bold", color: C.primary }}>{qtyText(logic.newStock)}</Text>
                  {logic.stock != null ? `  (${logic.newStock - logic.stock >= 0 ? "+" : ""}${qtyText(logic.newStock - logic.stock)})` : ""}
                </Text>
              ) : null}
              <View style={s.chips}>
                {logic.reasons.map((r) => (
                  <TouchableOpacity key={r.reasonId} style={[s.chip, logic.reasonId === r.reasonId && s.chipOn]} onPress={() => logic.setReasonId(r.reasonId)}>
                    <Text style={[s.chipText, logic.reasonId === r.reasonId && s.chipTextOn]}>{r.reasonName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Last movements */}
            <Text style={[s.sectionTitle, { marginTop: 14 }]}>LAST 30 DAYS</Text>
            <View style={s.table}>
              <View style={[s.row, s.header]}>
                <Text style={[styles.cDate, s.headerText]}>Date</Text>
                <Text style={[styles.cType, s.headerText]}>Type / doc</Text>
                <Text style={[styles.cQty, s.headerText]}>Qty</Text>
                <Text style={[styles.cQty, s.headerText]}>Stock</Text>
              </View>
              {logic.moves.length === 0 ? (
                <Text style={s.empty}>{logic.loading ? "Loading..." : "No movements in the last 30 days."}</Text>
              ) : (
                logic.moves.map((m) => {
                  const q = m.qtyIn - m.qtyOut;
                  return (
                    <View key={m.ledgerId} style={s.row}>
                      <Text style={styles.cDate}>{fmtDate(m.txnDate)}</Text>
                      <View style={styles.cType}>
                        <Text style={{ fontSize: 13, color: C.text }}>{m.txnTypeName}</Text>
                        <Text style={{ fontSize: 11, color: C.muted }}>{m.docNo}</Text>
                      </View>
                      <Text style={[styles.cQty, { color: q < 0 ? C.red : C.green, fontWeight: "bold" }]}>{q > 0 ? "+" : ""}{qtyText(q)}</Text>
                      <Text style={styles.cQty}>{qtyText(m.balance)}</Text>
                    </View>
                  );
                })
              )}
            </View>

            <TouchableOpacity style={s.outlineButton} onPress={logic.clearForm}>
              <Text style={s.outlineButtonText}>Clear</Text>
            </TouchableOpacity>
          </>
        )}
        <Text style={s.footer}>© {new Date().getFullYear()} IRM</Text>
      </ScrollView>

      <ItemPickers
        descModal={logic.descModal} setDescModal={logic.setDescModal} descResults={logic.descResults}
        searchByDescription={logic.searchByDescription} pickDescription={logic.pickDescription}
        choices={logic.choices} setChoices={logic.setChoices} pickItem={logic.pickItem}
      />
    </KeyboardAvoidingView>
  );
};

export default StockPage;
