import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  row: {
    flexDirection: "row", // Arrange cells horizontally
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
 
  cell: {
    flex: 1, // Each cell takes up 50% of the row's width
    justifyContent: "center",
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
  labelText: {
    color: "#333",
  },
  valueText: {
    color: "black",
    fontWeight: "bold",
  },
  inputTextBox: {
    borderColor: "gray",
    borderWidth: 1,
    fontSize: 30,
    fontWeight: "bold",
    flex: 1,
    width: "100%",
    padding: 0,
  margin: 0,
 
  },
   valueText_2: {
    color: "#555",
    fontWeight: "bold"
     
  
  },
  priceLinkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
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
    backgroundColor: "#DC3545", // Background color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10, // Rounded corners
  },
  buttonText: {
    color: "white", // Text color
    fontSize: 16, // Text size
    fontWeight: "bold", // Text weight
  },
  addLinkButton: {
    backgroundColor: "#28a745", // Green background
    padding: 10, // Padding
    borderRadius: 5, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
    width: 100, // Fixed width
  },
  deleteButton: {
    backgroundColor: "#DC3545", // Red background
    padding: 10, // Padding
    borderRadius: 5, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
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
  },  messageArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
    height: 20,
  },
});

export default styles;
