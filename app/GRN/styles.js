import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  row: {
    // flex: 1,
    flexDirection: "row", // Arrange cells horizontally
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 1,
  },
  cell: {
    flex: 0.8, // Each cell takes up 50% of the row's width
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cell2: {
    flex: 3, // Each cell takes up 50% of the row's width
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  labelText: {
    color: "#333",
  },
  valueText: {
    color: "#555",
    fontWeight: "bold",
  },
  inputTextBox: {
    borderColor: "gray",
    borderWidth: 1,
    fontSize: 25,
    fontWeight: "bold",
    width: "100%",
    padding: 0,
  margin: 0,
  
  },

  messageArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
    height: 20,
  },
  priceText: {
    flex: 1,
    fontSize: 30,
    color: "#228B22",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    width: "90%",
    height: "50%",
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },

  rightButtonContainer: {
    alignSelf: "flex-end", // Align the container to the right
    marginBottom: 10, // Add space between buttons and the New Price section
    flexDirection: "row", // Arrange buttons horizontally
  },
  scanButton: {
    width: 100, // Fixed width
    height: 100, // Fixed height
    backgroundColor: "#007BFF", // Background color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10, // Rounded corners
    marginBottom: 10, // Space between buttons
  },
  clearButton: {
    width: 100, // Fixed width
    height: 50, // Fixed height
    backgroundColor: "#aaaaee", // Background color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10, // Rounded corners
  },
  buttonText: {
    color: "white", // Text color
    fontSize: 16, // Text size
    fontWeight: "bold", // Text weight
  },
  saveButton: {
    backgroundColor: "#28a745", // Green background
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
    width: 100, // Fixed width
    height: 100, // Fixed height
  },
  loadButton: {
    backgroundColor: "#28a745", // Green background
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
    width: 100, // Fixed width
    height: 50, // Fixed height
  },
  deleteButton: {
    backgroundColor: "#DC3545", // Red background
    padding: 0, // Padding
    borderRadius: 0, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
    width: 100, // Fixed width
    height: 50, // Fixed height
  },
  returnGridContainer: {
    height: 250,
  },
  vw_2: {
    //backgroundColor: 'blue',
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "flex-end",
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
    //borderRadius: 8,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1, // For Android shadow
  },
  suggestionText: {
    color: "#333",
    fontSize: 15,
  },
  suggestionsList: {
    width: "100%",
    // maxHeight: 200, // Limit the height of the list
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
  },
  barcodeScannerContainer: {
    width: "100%",
    height: 120, // or 30 if you prefer
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default styles;
