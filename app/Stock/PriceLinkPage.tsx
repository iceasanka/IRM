import React from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import BarcodeScanner from "../../BarcodeScanner_2.js";
import styles from "./PriceLinkPageStyles.js";
import usePriceLinkPageLogic from "./PriceLinkPageLogic";

const PriceLinkPage = () => {
  const logic = usePriceLinkPageLogic();

  return (
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
      <View>
        <View style={[styles.row, , { backgroundColor: "#e9e9e9" }]}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Bar code</Text>
          </View>
          <View style={styles.cell}>
            <TextInput
              style={styles.valueText}
              value={logic.barcode}
              onChangeText={logic.setBarcode}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Item Code</Text>
          </View>
          <View style={styles.cell}>
            <TextInput
              style={styles.valueText}
              value={logic.itemCode}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Des.</Text>
          </View>
          <View style={styles.cell}>
            <TextInput
              style={styles.valueText}
              value={logic.itemDescrip}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Item Price</Text>
          </View>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <TextInput
                style={[styles.inputTextBox, {}]}
                value={logic.eRetPrice.toString()}
                keyboardType="numeric"
                onChangeText={(text) => logic.seteRetPrice(Number(text))}
              />
            </View>
            <View>
              <TouchableOpacity
                style={styles.addLinkButton}
                onPress={logic.handleSaveRetPrice}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.labelText}>Price Links</Text>
          </View>
          <View style={styles.cell}>
            <FlatList
              data={logic.priceLinks}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.priceLinkRow}>
                  <Text style={styles.priceText}>{item.price}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => logic.handleDeletePriceLink(item.price)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>

        <View style={[styles.row]}>
          <View style={[styles.cell, { width: "50%" }]}>
            <Text style={[styles.labelText]}>New Price</Text>
          </View>
          <View
            style={[
              styles.cell,
              {
                width: "20%",
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-end",
              },
            ]}
          >
            <TextInput
              style={[styles.inputTextBox]}
              value={logic.newPrice}
              onChangeText={logic.setNewPrice}
              keyboardType="numeric"
              ref={logic.inputRef}
            />
          </View>
          <View
            style={[
              styles.cell,
              {
                width: "30%",
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-end",
              },
            ]}
          >
            <TouchableOpacity
              style={styles.addLinkButton}
              onPress={logic.handleAddPriceLink}
            >
              <Text style={styles.buttonText}>Add Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.rightButtonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={logic.clearForm}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PriceLinkPage;
