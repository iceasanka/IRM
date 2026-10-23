import { StyleSheet } from "react-native";
import { C } from "../../theme";

// Same colours as the back office and the Return Stock page (indigo #4B49AC, sky blue, light grey page)
export { C };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.page },
  scroll: { padding: 10 },

  // camera + typed code
  cameraBox: { height: 170, overflow: "hidden", backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  scanRow: { flexDirection: "row", gap: 8, marginTop: 10 },
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

  sectionTitle: { fontSize: 13, fontWeight: "bold", color: C.primary, marginTop: 12, marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  priceInput: {
    flex: 1, height: 52, borderWidth: 1, borderColor: C.primary, backgroundColor: C.white, paddingHorizontal: 10,
    fontSize: 26, fontWeight: "bold", color: C.red, textAlign: "right",
  },
  remarkInput: {
    flex: 1, height: 44, borderWidth: 1, borderColor: C.border, backgroundColor: C.white, paddingHorizontal: 10,
    fontSize: 15, color: C.text, marginTop: 6,
  },
  bigButton: { height: 52, minWidth: 100, paddingHorizontal: 14, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" },
  bigButtonGreen: { backgroundColor: C.green },
  bigButtonText: { color: C.white, fontSize: 17, fontWeight: "bold" },
  disabled: { opacity: 0.4 },

  // links grid
  table: { borderWidth: 1, borderColor: C.border, backgroundColor: C.card },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  header: { backgroundColor: C.primary, paddingVertical: 6 },
  headerText: { color: C.white, fontWeight: "bold", fontSize: 13 },
  colPrice: { width: 90, textAlign: "right", fontSize: 18, fontWeight: "bold", color: C.text },
  colRemark: { flex: 1, paddingHorizontal: 10, fontSize: 13, color: C.text },
  colDate: { fontSize: 11, color: C.muted },
  colAction: { width: 74, alignItems: "flex-end" },
  normalRow: { backgroundColor: C.primarySoft },
  deleteButton: { paddingHorizontal: 10, paddingVertical: 7, backgroundColor: C.red },
  deleteText: { color: C.white, fontWeight: "bold", fontSize: 13 },
  normalTag: { fontSize: 11, fontWeight: "bold", color: C.primary },
  empty: { textAlign: "center", color: C.muted, padding: 12 },

  clearButton: { marginTop: 12, alignSelf: "flex-end", paddingHorizontal: 18, paddingVertical: 10, borderWidth: 1, borderColor: C.primary },
  clearText: { color: C.primary, fontWeight: "bold", fontSize: 15 },
  hint: { textAlign: "center", color: C.muted, padding: 18 },
  footer: { textAlign: "center", color: C.muted, fontSize: 12, marginTop: 16 },

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

export default styles;
