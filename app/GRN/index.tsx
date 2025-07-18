import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import BarcodeScanner from "../../BarcodeScanner_2.js";
import GrnList from "./GrnList.js";
import styles from "./styles.js";
import useGrnPageLogic from "./GrnPageLogic.js";

const GrnPage: React.FC = () => {
  const logic = useGrnPageLogic();

  return (
    <View style={styles.container}>
      {/* Barcode scanner always at the top */}
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
      <View>
        <View style={[styles.row, , { backgroundColor: "#e9e9e9" }]}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Bar code</Text>
          </View>
          <View style={styles.cell2}>
            <TextInput
              style={styles.valueText}
              value={logic.itemDetails?.barcode || ""}
              onChangeText={logic.setBarcode}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Des.</Text>
          </View>
          <View style={styles.cell2}>
            <TextInput
              style={styles.valueText}
              value={logic.itemDetails?.descrip || ""}
              editable={false}
            />
          </View>
        </View>
        {/* Cost Price */}
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Cost Price</Text>
          </View>
          <View style={styles.cell2}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={[styles.inputTextBox, { flex: 1, marginRight: 5 }]}
                keyboardType="numeric"
                value={logic.formValues.CostPrice}
                onChangeText={(text) =>
                  logic.setFormValues({ ...logic.formValues, CostPrice: text })
                }
              />
              <Text style={{ flex: 2, fontWeight: "bold", fontSize: 20 }}>
                {logic.itemDetails?.cost_Price ?? ""}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>ERet Price</Text>
          </View>
          <View style={styles.cell2}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={[styles.inputTextBox, { flex: 1, marginRight: 5 }]}
                value={logic.formValues.ERetPrice}
                keyboardType="numeric"
                onChangeText={(text) =>
                  logic.setFormValues({ ...logic.formValues, ERetPrice: text })
                }
              />
              <Text style={{ flex: 2, fontWeight: "bold", fontSize: 20 }}>
                {logic.itemDetails?.eRet_Price ?? ""}
                {logic.priceLinks.length > 0 && (
                  <Text style={{ color: "green" }}>
                    {" | " + logic.priceLinks.map((p) => p.price).join(" | ")}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </View>
        {/* Item Ref */}
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Item Ref</Text>
          </View>
          <View style={styles.cell2}>
            <TextInput
              style={styles.inputTextBox}
              value={logic.formValues.ItemRefCode}
              returnKeyType="next"
              onChangeText={(text) =>
                logic.setFormValues({ ...logic.formValues, ItemRefCode: text })
              }
              onSubmitEditing={() => logic.qtyInputRef.current?.focus()}
            />
          </View>
        </View>
        {/* Qty */}
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Qty</Text>
          </View>
          <View style={styles.cell2}>
            <TextInput
              //ref={logic.qtyInputRef}
              ref={logic.itemRefInputRef}
              style={styles.inputTextBox}
              value={logic.formValues.Qty}
              keyboardType="numeric"
              onChangeText={(text) =>
                logic.setFormValues({ ...logic.formValues, Qty: text })
              }
            />
          </View>
        </View>
      </View>
      {/* Bar code scaner function */}
      <View style={styles.rightButtonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={logic.DeleteItems}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={logic.clearAllForm}
        >
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={logic.clearForm}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={logic.saveTempGrn}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
      {/* Supplier search */}
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.labelText}>Supplier</Text>
        </View>
        <View style={styles.cell}>
          <TouchableOpacity onPress={() => logic.setsuppModalVisible(true)}>
            <TextInput
              style={styles.valueText}
              value={logic._suppCode}
              editable={false}
              placeholder="Touch to search"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.cell}>
          <TouchableOpacity
            style={styles.loadButton}
            onPress={() => logic.GetGrnItemsByGrnRef(logic._suppCode)}
          >
            <Text style={styles.buttonText}>Load</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={logic._suppmodalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => logic.setsuppModalVisible(false)}
      >
        <View style={styles.modalContainer_2}>
          <View style={styles.popup_2}>
            <TextInput
              style={styles.searchInput}
              onChangeText={logic.handleSuppDesChange}
              placeholder="Type to search"
            />
            <FlatList
              data={logic._suppSuggestions}
              keyExtractor={(item) => item.supp_Code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => logic.GetSupplier(item)}
                  style={styles.suggestionItem}
                >
                  <Text style={styles.suggestionText}>
                    {" "}
                    {item.supp_Code} - {item.supp_Name}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
            <Button
              title="Close"
              onPress={() => logic.setsuppModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      {/* Data grid */}
      <View style={styles.returnGridContainer}>
        <GrnList data={logic._returnItems} toggleSelect={logic.toggleSelect} />
      </View>
    </View>
  );
};

export default GrnPage;
