import { StyleSheet } from "react-native";

// Shared look of the app pages (same colours as the back office: indigo #4B49AC, sky blue #98BDFF, light grey page -
// no pure white). Kept outside app/ so expo-router does not treat it as a screen.
export const C = {
  page: "#E6E9F1",
  card: "#F5F6FA",
  border: "#CDD3E0",
  text: "#1E1F3F",
  muted: "#6B6F80",
  primary: "#4B49AC",
  primarySoft: "#DDE6FF",
  sky: "#98BDFF",
  green: "#1E8E5E",
  greenSoft: "#D6F2E4",
  red: "#D9434F",
  redSoft: "#FBE0E2",
  blue: "#2F6FD6",
  blueSoft: "#DCE8FF",
  white: "#FFFFFF",
};

export const common = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.page },
  scroll: { padding: 10 },

  // supplier bar (GRN, Return Stock)
  supplierBar: { flexDirection: "row", alignItems: "center", backgroundColor: C.primary, paddingHorizontal: 12, paddingVertical: 10 },
  supplierLabel: { color: C.sky, fontSize: 12, fontWeight: "bold" },
  supplierName: { color: C.white, fontSize: 17, fontWeight: "bold" },
  supplierChange: { marginLeft: "auto", borderWidth: 1, borderColor: C.sky, paddingHorizontal: 12, paddingVertical: 6 },
  supplierChangeText: { color: C.white, fontWeight: "bold" },

  // camera + typed code
  cameraBox: { height: 170, overflow: "hidden", backgroundColor: "#000", alignItems: "center", justifyContent: "center", marginTop: 10 },
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

  // cards
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, padding: 10, marginTop: 10 },
  itemName: { fontSize: 18, fontWeight: "bold", color: C.text },
  itemCode: { fontSize: 13, color: C.muted, marginTop: 2 },
  infoRow: { flexDirection: "row", marginTop: 8 },
  infoCell: { flex: 1 },
  infoLabel: { fontSize: 11, color: C.muted },
  infoValue: { fontSize: 16, fontWeight: "bold", color: C.text },
  sectionTitle: { fontSize: 13, fontWeight: "bold", color: C.primary, marginTop: 12, marginBottom: 4 },
  hint: { textAlign: "center", color: C.muted, padding: 18 },
  footer: { textAlign: "center", color: C.muted, fontSize: 12, marginTop: 16 },

  // chips
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.border, backgroundColor: C.white },
  chipOn: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { color: C.text, fontSize: 13 },
  chipTextOn: { color: C.white, fontWeight: "bold" },

  // big inputs / buttons
  bigInput: {
    flex: 1, height: 52, borderWidth: 1, borderColor: C.primary, backgroundColor: C.white, paddingHorizontal: 10,
    fontSize: 24, fontWeight: "bold", color: C.text, textAlign: "right",
  },
  bigButton: { height: 52, minWidth: 96, paddingHorizontal: 14, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" },
  bigButtonText: { color: C.white, fontSize: 17, fontWeight: "bold" },
  disabled: { opacity: 0.4 },
  outlineButton: { alignSelf: "flex-end", paddingHorizontal: 18, paddingVertical: 10, borderWidth: 1, borderColor: C.primary, marginTop: 12 },
  outlineButtonText: { color: C.primary, fontWeight: "bold", fontSize: 15 },

  // grid
  table: { borderWidth: 1, borderColor: C.border, backgroundColor: C.card },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 7, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  header: { backgroundColor: C.primary, paddingVertical: 6 },
  headerText: { color: C.white, fontWeight: "bold", fontSize: 13 },
  empty: { textAlign: "center", color: C.muted, padding: 12 },

  // popups
  modalBack: { flex: 1, backgroundColor: "rgba(20,20,50,0.45)", justifyContent: "center", padding: 16 },
  modalBox: { backgroundColor: C.card, maxHeight: "80%", padding: 12 },
  modalTitle: { fontSize: 17, fontWeight: "bold", color: C.text, marginBottom: 8 },
  searchInput: {
    height: 46, borderWidth: 1, borderColor: C.primary, backgroundColor: C.white, paddingHorizontal: 10, fontSize: 16, color: C.text,
  },
  suggestionItem: { paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  suggestionText: { fontSize: 16, color: C.text },
  suggestionSub: { fontSize: 12, color: C.muted },
  modalClose: { marginTop: 10, height: 46, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" },
});

// indigo header for the stack screens (app/_layout.tsx)
export const headerOptions = {
  headerStyle: { backgroundColor: C.primary },
  headerTintColor: C.white,
};
