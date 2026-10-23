import { StyleSheet } from "react-native";
import { C } from "../../theme";

// colours: theme.js (same as the back office)
export { C };

const returnStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.page },
  scroll: { padding: 10, paddingBottom: 90 },

  // supplier bar
  supplierBar: {
    flexDirection: "row", alignItems: "center", backgroundColor: C.primary, paddingHorizontal: 12, paddingVertical: 10,
  },
  supplierLabel: { color: C.sky, fontSize: 12, fontWeight: "bold" },
  supplierName: { color: C.white, fontSize: 17, fontWeight: "bold" },
  supplierChange: {
    marginLeft: "auto", borderWidth: 1, borderColor: C.sky, paddingHorizontal: 12, paddingVertical: 6,
  },
  supplierChangeText: { color: C.white, fontWeight: "bold" },

  // camera + typed code
  scanRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  cameraBox: { height: 170, overflow: "hidden", backgroundColor: "#000", marginTop: 10, alignItems: "center", justifyContent: "center" },
  codeInput: {
    flex: 1, height: 44, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, paddingHorizontal: 10,
    fontSize: 16, color: C.text,
  },
  smallButton: { height: 44, paddingHorizontal: 14, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" },
  smallButtonOutline: { height: 44, paddingHorizontal: 12, borderWidth: 1, borderColor: C.primary, alignItems: "center", justifyContent: "center" },
  smallButtonText: { color: C.white, fontWeight: "bold", fontSize: 15 },
  smallButtonOutlineText: { color: C.primary, fontWeight: "bold", fontSize: 15 },

  // message
  message: { marginTop: 8, paddingVertical: 6, paddingHorizontal: 10, fontWeight: "bold", textAlign: "center" },
  messageOk: { backgroundColor: C.greenSoft, color: C.green },
  messageErr: { backgroundColor: C.redSoft, color: C.red },

  // item card
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, padding: 10, marginTop: 10 },
  itemName: { fontSize: 18, fontWeight: "bold", color: C.text },
  itemCode: { fontSize: 13, color: C.muted, marginTop: 2 },
  infoRow: { flexDirection: "row", marginTop: 8 },
  infoCell: { flex: 1 },
  infoLabel: { fontSize: 11, color: C.muted },
  infoValue: { fontSize: 16, fontWeight: "bold", color: C.text },
  stockOk: { color: C.green, fontSize: 22 },
  stockBad: { color: C.red, fontSize: 22 },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  qtyButton: { width: 48, height: 48, backgroundColor: C.primarySoft, alignItems: "center", justifyContent: "center" },
  qtyButtonText: { fontSize: 26, fontWeight: "bold", color: C.primary },
  qtyInput: {
    width: 90, height: 48, marginHorizontal: 6, borderWidth: 1, borderColor: C.primary, backgroundColor: C.white,
    textAlign: "center", fontSize: 22, fontWeight: "bold", color: C.text,
  },
  addButton: { flex: 1, height: 48, marginLeft: 10, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" },
  addButtonText: { color: C.white, fontSize: 18, fontWeight: "bold" },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.border, backgroundColor: C.white },
  chipOn: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { color: C.text, fontSize: 13 },
  chipTextOn: { color: C.white, fontWeight: "bold" },

  // list
  listHeader: { flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 6 },
  listTitle: { fontSize: 16, fontWeight: "bold", color: C.text },
  listTotal: { marginLeft: "auto", fontSize: 16, fontWeight: "bold", color: C.primary },

  // bottom actions
  bottomBar: {
    position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", gap: 6, padding: 8,
    backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border,
  },
  barButton: { flex: 1, height: 50, alignItems: "center", justifyContent: "center" },
  barButtonText: { color: C.white, fontWeight: "bold", fontSize: 15 },
  barDelete: { backgroundColor: C.red },
  barReady: { backgroundColor: C.green },
  barProcess: { backgroundColor: C.primary },
  barDisabled: { opacity: 0.4 },

  // popups
  modalBack: { flex: 1, backgroundColor: "rgba(20,20,50,0.45)", justifyContent: "center", padding: 16 },
  modalBox: { backgroundColor: C.card, maxHeight: "80%", padding: 12 },
  modalTitle: { fontSize: 17, fontWeight: "bold", color: C.text, marginBottom: 8 },
  searchInput: {
    height: 46, borderWidth: 1, borderColor: C.primary, backgroundColor: C.white, paddingHorizontal: 10, fontSize: 16,
    color: C.text,
  },
  suggestionItem: { paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  suggestionText: { fontSize: 16, color: C.text },
  suggestionSub: { fontSize: 12, color: C.muted },
  modalClose: { marginTop: 10, height: 46, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" },
});

export default returnStyles;
