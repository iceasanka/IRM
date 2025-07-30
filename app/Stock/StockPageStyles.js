import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  suggestionsList: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
  },
  totalStockContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  searchInput: {
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  vw_1: {},
  vw_2: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  vw_3: {
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
  barcodeScannerContainer: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  container: {
    //flex: 1,
    padding: 10,
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
   row_2: {
    flexDirection: "row",
    borderBottomColor: "#ddd",
    
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
    cell_3: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cell_3_label: {
  width: 120, // fixed width for label
  justifyContent: "center",
  paddingHorizontal: 3,
},
cell_3_input: {
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: 3,
},
    cell_2: {
    flex: 2,
    justifyContent: "center",
  },
  labelText: {
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
  inputTextBox: {
    borderColor: "gray",
    fontSize: 20,
    fontWeight: "bold",
     padding: 0,
  margin: 5,
  borderWidth: 1,
  height:35,
  },
  inputTextBoxDes: {
    borderColor: "gray",
    borderWidth: 1,
    color: "#555",
  },
  scanButton: {
    width: 100,
    height: 100,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  clearButton: {
    width: 100,
    height: 50,
    backgroundColor: "#DC3545",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
  },
  toggleButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  totalStockToggleButton: {
    marginLeft: 10,
  },
  totalStockInput: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 5,
    fontSize: 16,
    color: "#333",
  },
   messageArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
    height: 20,
  },
});

export default styles;
