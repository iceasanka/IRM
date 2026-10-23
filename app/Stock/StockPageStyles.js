import { StyleSheet } from "react-native";
import { C } from "../../theme";

// Stock page only - the shared parts are in theme.js
const styles = StyleSheet.create({
  tillBar: { backgroundColor: C.greenSoft, paddingHorizontal: 12, paddingVertical: 7 },
  tillBarBad: { backgroundColor: C.redSoft },
  tillText: { color: C.text, fontSize: 12, fontWeight: "600" },

  stockRow: { flexDirection: "row", alignItems: "flex-end", marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border },
  stockQty: { fontSize: 40, fontWeight: "bold", color: C.green, lineHeight: 46 },

  modeRow: { flexDirection: "row", gap: 6, marginBottom: 10 },
  modeButton: { flex: 1, height: 42, borderWidth: 1, borderColor: C.primary, alignItems: "center", justifyContent: "center", backgroundColor: C.white },
  modeOn: { backgroundColor: C.primary },
  modeText: { color: C.primary, fontWeight: "bold", fontSize: 14 },
  modeTextOn: { color: C.white },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  preview: { marginTop: 8, fontSize: 15, color: C.text },

  cDate: { width: 82, fontSize: 12, color: C.text },
  cType: { flex: 1, paddingHorizontal: 6 },
  cQty: { width: 62, textAlign: "right", fontSize: 14, color: C.text },
});

export default styles;
