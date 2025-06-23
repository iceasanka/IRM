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
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  labelText: {
    fontWeight: "bold",
    color: "#333",
  },
  valueText: {
    color: "#555",
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
    fontSize: 18,
    fontWeight: "bold",
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
  },
});

export default returnStyles;
