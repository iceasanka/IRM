import { StyleSheet } from "react-native";
import { C } from "../../theme";

// GRN page only - the shared parts are in theme.js
const styles = StyleSheet.create({
  priceRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  note: { marginTop: 6, fontSize: 12, color: C.red },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  qtyButton: { width: 48, height: 48, backgroundColor: C.primarySoft, alignItems: "center", justifyContent: "center" },
  qtyButtonText: { fontSize: 26, fontWeight: "bold", color: C.primary },
  qtyInput: {
    width: 90, height: 48, marginHorizontal: 6, borderWidth: 1, borderColor: C.primary, backgroundColor: C.white,
    textAlign: "center", fontSize: 22, fontWeight: "bold", color: C.text,
  },
  addButton: { flex: 1, height: 48, marginLeft: 10, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" },

  listHeader: { flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 4 },
  listTitle: { fontSize: 16, fontWeight: "bold", color: C.text },
  listSub: { fontSize: 12, color: C.muted, marginBottom: 6 },

  modalButton: { flex: 1, height: 48, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" },
});

export default styles;
