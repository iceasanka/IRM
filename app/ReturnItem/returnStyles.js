import { StyleSheet } from "react-native";

const returnStyles = StyleSheet.create({
  returnGridContainer: {
    height: 250,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
   row_3: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cell_3_input: {
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: 3,
},
  cell_3_label: {
  width: 120, // fixed width for label
  justifyContent: "center",
  paddingHorizontal: 3,
},
  labelText: {
    fontWeight: "bold",
    color: "#333",
  },
  valueText: {
    color: "#555",
     fontWeight: "bold",
  },
    valueText_2: {
    color: "#555",
    fontWeight: "bold",
     padding: 0,
  margin: 0,
  borderWidth: 0,
  
  },
  modalContainer_2: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup_2: {
    width: "90%",
    height: "70%",
    marginTop: 60,
    backgroundColor: "white",
    borderRadius: 0,
    padding: 5,
    alignItems: "center",
  },
  searchInput: {
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  suggestionItem: {
    backgroundColor: "white",
    padding: 2,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  suggestionText: {
    color: "#333",
    fontSize: 15,
  },
  suggestionsList: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
  },
  vw_2: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    width: "90%",
    height: "45%",
    marginTop: 60,
    backgroundColor: "white",
    borderRadius: 0,
    padding: 5,
    alignItems: "center",
  },
  inputTextBox: {
    borderColor: "gray",
    borderWidth: 1,
    fontSize: 30,
    fontWeight: "bold",
    padding: 0,
    margin: 0,
    borderWidth: 1,
    color: "#d42727bd",
  },
  scanButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DC3545",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addLinkButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  }, barcodeScannerContainer: {
    width: "100%",
    height: 120, // or 30 if you prefer
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },  messageArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
    height: 20,
  },
});

export default returnStyles;
