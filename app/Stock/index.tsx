import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import BarcodeScanner from "../../BarcodeScanner_2.js";
import styles from "./StockPageStyles.js";
import useStockPageLogic from "./StockPageLogic.js";

const StockPage = () => {
  const logic = useStockPageLogic();

  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <View style={styles.barcodeScannerContainer}>
            <BarcodeScanner onScan={logic.handleScan} />
          </View>
          <View style={styles.messageArea}>
            {logic.message ? (
              <Text
                style={{
                  color: "green",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {logic.message}
              </Text>
            ) : null}
          </View>
          <View style={styles.vw_1}>
            <View style={[styles.row, { backgroundColor: "#e9e9e9" }]}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Item Code</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={styles.valueText}
                  value={logic.items.item_Code}
                />
              </View>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Ref Code</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={styles.valueText}
                  value={logic.items.ref_Code}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Barcode</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={styles.valueText}
                  value={logic.items.barcode}
                  onChangeText={logic.setBarcode}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Description</Text>
              </View>
              <View style={styles.cell}>
                <TouchableOpacity onPress={() => logic.setModalVisible(true)}>
                  <TextInput
                    style={styles.valueText}
                    value={logic.description}
                    editable={false}
                    placeholder="Touch to search"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Modal
              visible={logic.modalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => logic.setModalVisible(false)}
            >
              <View style={styles.modalContainer_2}>
                <View style={styles.popup_2}>
                  <TextInput
                    ref={logic.inputRef2}
                    style={styles.searchInput}
                    onChangeText={logic.handleDescriptionChange}
                    placeholder="Type to search"
                  />
                  <FlatList
                    data={logic.suggestions}
                    keyExtractor={(item) => item.item_Code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => logic.handleSuggestionPress(item)}
                        style={styles.suggestionItem}
                      >
                        <Text style={styles.suggestionText}>
                          {item.descrip}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={styles.suggestionsList}
                  />
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => logic.setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View style={[styles.row, { backgroundColor: "#f9f9f9" }]}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Price</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={styles.valueText}
                  value={
                    logic.items.eRet_Price
                      ? logic.items.eRet_Price.toString()
                      : ""
                  }
                />
              </View>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Discount</Text>
              </View>
              <View style={styles.cell}>
                <TextInput style={styles.valueText} value={logic.items.tax3} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Price Link</Text>
              </View>
              <View style={styles.cell}>
                <TextInput style={styles.valueText} value={logic._priceLink} />
              </View>
            </View>
            <View style={[styles.row, { backgroundColor: "#f1f1f1" }]}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Stock</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={[styles.valueText, { color: "#228B22", fontSize: 30 }]}
                  value={logic.stock.toString()}
                />
              </View>
              <View style={styles.cell}>
                <Text style={styles.labelText}>POS Stock</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={[styles.valueText, { color: "#FF0000", fontSize: 30 }]}
                  value={logic.posStock.toString()}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Total Stock</Text>
              </View>
              <View style={[styles.cell, styles.totalStockContainer]}>
                <TextInput
                  style={[styles.valueText, { color: "#007BFF", fontSize: 30 }]}
                  value={logic.totalStock}
                />
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    styles.totalStockToggleButton,
                    {
                      backgroundColor: logic.isOn ? "#28a745" : "#DC3545",
                    },
                  ]}
                  onPress={logic.toggleOnOff}
                >
                  <Text style={styles.buttonText}>
                    {logic.isOn ? "WithPoSt" : "WithOutPoSt"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.labelText}>Add/OpStock</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={[styles.inputTextBox]}
                  value={logic.addOpStock}
                  onChangeText={(text) => {
                    logic.setAddOpStock(text);
                    logic.updateTotalStock(text);
                  }}
                  ref={logic.inputRef}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
          <View style={styles.vw_3}>
            <View style={{ width: 130, padding: 2 }}>
              <TouchableOpacity
                style={styles.addLinkButton}
                onPress={() => logic.confirmUpdateStock("OPB")}
              >
                <Text style={styles.buttonText}>Opning Stock</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: 120, padding: 2 }}>
              <TouchableOpacity
                style={styles.addLinkButton}
                onPress={() => logic.confirmUpdateStock("ADD")}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.vw_2}>
            <View>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={logic.clearForm}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.vw_2}>
            <View style={{ width: 120, padding: 2 }}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => logic.confirmFlushData()}
              >
                <Text style={styles.buttonText}>Flush Data</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: 120, padding: 2 }}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => logic.confirmFlushItem(logic.items.item_Code)}
              >
                <Text style={styles.buttonText}>Flush Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StockPage;
