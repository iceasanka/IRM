import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { C } from "../../theme";

// Lines of the supplier's draft GRN (newest first). Touch a line to change / delete it.
// Rendered as plain rows - the page scrolls them.
const money = (n) => (n == null ? "" : Number(n).toFixed(2));
const qtyText = (q) => String(Number(Number(q).toFixed(3)));

const GrnList = ({ data, onPress }) => {
  if (!data || data.length === 0) return <Text style={styles.empty}>Nothing scanned for this supplier yet.</Text>;

  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.desc, styles.headerText]}>Item</Text>
        <Text style={[styles.num, styles.headerText]}>Qty</Text>
        <Text style={[styles.price, styles.headerText]}>Cost / Sell</Text>
        <Text style={[styles.amt, styles.headerText]}>Amount</Text>
      </View>
      {data.map((l) => {
        const newSell = l.itemRetailPrice != null && Math.abs(l.sellPrice - l.itemRetailPrice) >= 0.005;
        const newCost = l.itemCostPrice != null && Math.abs(l.costPrice - l.itemCostPrice) >= 0.005;
        return (
          <TouchableOpacity key={l.idx} activeOpacity={0.7} onPress={() => onPress(l)} style={styles.row}>
            <View style={styles.desc}>
              <Text style={styles.name} numberOfLines={2}>{l.descrip}</Text>
              <Text style={styles.sub}>{l.barcode || l.refCode} · stock {qtyText(l.stockQty)}</Text>
            </View>
            <Text style={styles.num}>{qtyText(l.qty)}</Text>
            <View style={styles.price}>
              <Text style={[styles.priceText, newCost && styles.changed]}>{money(l.costPrice)}</Text>
              <Text style={[styles.priceText, newSell && styles.changed]}>{money(l.sellPrice)}</Text>
            </View>
            <Text style={styles.amt}>{money(l.gAmount)}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  table: { borderWidth: 1, borderColor: C.border, backgroundColor: C.card },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  header: { backgroundColor: C.primary, paddingVertical: 6 },
  headerText: { color: C.white, fontWeight: "bold", fontSize: 13 },
  desc: { flex: 1, paddingHorizontal: 4 },
  name: { fontSize: 15, fontWeight: "600", color: C.text },
  sub: { fontSize: 11, color: C.muted, marginTop: 2 },
  num: { width: 46, textAlign: "right", fontSize: 16, fontWeight: "bold", color: C.text },
  price: { width: 80, alignItems: "flex-end" },
  priceText: { fontSize: 13, color: C.text, textAlign: "right" },
  // differs from the item's price now
  changed: { color: C.red, fontWeight: "bold" },
  amt: { width: 78, textAlign: "right", fontSize: 14, color: C.text },
  empty: { textAlign: "center", color: C.muted, padding: 16, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
});

export default GrnList;
