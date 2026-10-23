import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { C } from "./returnStyles";

// The supplier's return list (same rows as the back office Return Items page). Tap a row to select it.
// Status: 1 Added (blue), 2 Ready (green). Rendered as plain rows - the page scrolls them.
const money = (n) => (n ?? 0).toFixed(2);
const qtyText = (q) => (Number.isInteger(q) ? String(q) : String(Number(q.toFixed(3))));

const RetunItemListPage = ({ data, selected, toggleSelect }) => {
  if (!data || data.length === 0) return <Text style={styles.empty}>Nothing in the return list for this supplier.</Text>;

  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.check, styles.headerText]}>✓</Text>
        <Text style={[styles.desc, styles.headerText]}>Item</Text>
        <Text style={[styles.num, styles.headerText]}>Qty</Text>
        <Text style={[styles.amt, styles.headerText]}>Amount</Text>
      </View>
      {data.map((item) => {
        const on = selected.has(item.returnId);
        return (
          <TouchableOpacity key={item.returnId} activeOpacity={0.7} onPress={() => toggleSelect(item.returnId)}
            style={[styles.row, on && styles.rowOn]}>
            <View style={[styles.box, on && styles.boxOn]}>{on ? <Text style={styles.boxTick}>✓</Text> : null}</View>
            <View style={styles.desc}>
              <Text style={styles.name} numberOfLines={2}>{item.descrip}</Text>
              <View style={styles.subRow}>
                <Text style={[styles.badge, item.status === 2 ? styles.badgeReady : styles.badgeAdded]}>{item.statusText}</Text>
                {item.reason ? <Text style={styles.sub}>{item.reason}</Text> : null}
                <Text style={styles.sub}>{item.barcode || item.refCode}</Text>
                {item.source === 2 ? <Text style={styles.sub}>· office</Text> : null}
              </View>
            </View>
            <Text style={styles.num}>{qtyText(item.qty)}</Text>
            <Text style={styles.amt}>{money(item.amount)}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  table: { borderWidth: 1, borderColor: C.border, backgroundColor: C.card },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  rowOn: { backgroundColor: C.primarySoft },
  header: { backgroundColor: C.primary, paddingVertical: 6 },
  headerText: { color: C.white, fontWeight: "bold", fontSize: 13 },
  check: { width: 30, textAlign: "center" },
  box: { width: 22, height: 22, marginHorizontal: 4, borderWidth: 2, borderColor: C.primary, alignItems: "center", justifyContent: "center", backgroundColor: C.white },
  boxOn: { backgroundColor: C.primary },
  boxTick: { color: C.white, fontWeight: "bold", fontSize: 13, lineHeight: 15 },
  desc: { flex: 1, paddingHorizontal: 6 },
  name: { fontSize: 15, fontWeight: "600", color: C.text },
  subRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 3 },
  sub: { fontSize: 11, color: C.muted },
  badge: { fontSize: 11, fontWeight: "bold", paddingHorizontal: 6, paddingVertical: 1 },
  badgeAdded: { backgroundColor: C.blueSoft, color: C.blue },
  badgeReady: { backgroundColor: C.greenSoft, color: C.green },
  num: { width: 50, textAlign: "right", fontSize: 16, fontWeight: "bold", color: C.text },
  amt: { width: 82, textAlign: "right", fontSize: 14, color: C.text },
  empty: { textAlign: "center", color: C.muted, padding: 16, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
});

export default RetunItemListPage;
