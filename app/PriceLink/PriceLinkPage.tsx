import React, { useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import BarcodeScanner from "../../BarcodeScanner_2.js";
import styles from "./PriceLinkPageStyles.js";
import usePriceLinkPageLogic from "./PriceLinkPageLogic";

const PriceLinkPage = () => {
  const logic = usePriceLinkPageLogic();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={50} // adjust if you have a header
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
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
                <View style={[styles.row, { backgroundColor: "#e9e9e9" }]}>
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

                <View style={[styles.row, { backgroundColor: "#e9e9e9" }]}>
                  <View style={styles.cell_3_label}>
                    <Text style={styles.labelText}>Des.</Text>
                  </View>
                  <View style={styles.cell_3_input}>
                    <TextInput
                      style={[
                        styles.valueText,
                        {
                          padding: 0,
                          margin: 0,
                          height: 35,
                          width: "100%",
                          color: "#2782c3ff",
                        },
                      ]}
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
                    <View style={{ flex: 1, paddingRight: 1 }}>
                      <TextInput
                        style={[styles.inputTextBox, { color: "#d3401fff" }]}
                        value={logic.eRetPrice.toString()}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          logic.seteRetPrice(Number(text))
                        }
                      />
                    </View>
                    <View>
                      <TouchableOpacity
                        style={styles.addLinkButton}
                        onPress={logic.handleSaveRetPrice}
                      >
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          Save
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={[styles.row, { backgroundColor: "#e9e9e9" }]}>
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
                            onPress={() =>
                              logic.handleDeletePriceLink(item.price)
                            }
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
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={logic.clearForm}
                >
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>© 2025 IRM</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default PriceLinkPage;
