import React from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Modal,
  TouchableOpacity,
  Button,
} from "react-native";
import BarcodeScanner from "../../BarcodeScanner.js";
import RetunItemListPage from "./RetunItemListPage.js";
import returnStyles from "./returnStyles.js";
import useReturnPageLogic from "./useReturnPageLogic.js";

const ReturnPage = () => {
  const logic = useReturnPageLogic();

  return (
    <View style={returnStyles.container}>
      <View>
        {/* Itemcode */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Item Code</Text>
          </View>
          <View style={returnStyles.cell}>
            <TextInput
              style={returnStyles.valueText}
              value={logic._items.item_Code}
            />
          </View>
        </View>
        {/* Barcode */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Barcode</Text>
          </View>
          <View style={returnStyles.cell}>
            <TextInput
              style={returnStyles.valueText}
              value={logic._items.barcode}
              onChangeText={logic.setBarcode}
            />
          </View>
        </View>
        {/* Description */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Description</Text>
          </View>
          <View style={returnStyles.cell}>
            <TouchableOpacity onPress={() => logic.setModalVisible(true)}>
              <TextInput
                style={returnStyles.valueText}
                value={logic._description}
                editable={false}
                placeholder="Touch to search"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Description popup */}
        <Modal
          visible={logic._modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => logic.setModalVisible(false)}
        >
          <View style={returnStyles.modalContainer_2}>
            <View style={returnStyles.popup_2}>
              <TextInput
                ref={logic.inputRef2}
                style={returnStyles.searchInput}
                onChangeText={logic.handleDescriptionChange}
                placeholder="Type to search"
              />
              <FlatList
                data={logic._suggestions}
                keyExtractor={(item) => item.item_Code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => logic.GetItem(item)}
                    style={returnStyles.suggestionItem}
                  >
                    <Text style={returnStyles.suggestionText}>
                      {item.descrip}
                    </Text>
                  </TouchableOpacity>
                )}
                style={returnStyles.suggestionsList}
              />
              <Button
                title="Close"
                onPress={() => logic.setModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
        {/* Add return Item */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Return Item</Text>
          </View>
          <View style={returnStyles.cell}>
            <TextInput
              style={returnStyles.inputTextBox}
              value={logic._retunQty}
              onChangeText={logic.setReturnQty}
              ref={logic.inputRef}
              keyboardType="numeric"
            />
          </View>
        </View>
        {/* Stock */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Stock</Text>
          </View>
          <View style={returnStyles.cell}>
            <TextInput
              style={returnStyles.valueText}
              value={logic._stock.toString()}
            />
          </View>
        </View>
        <View style={returnStyles.vw_2}>
          <View style={{ width: 120, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.clearButton}
              onPress={logic.clearForm}
            >
              <Text style={returnStyles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: 120, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.scanButton}
              onPress={() => logic.setScanning(true)}
            >
              <Text style={returnStyles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: 120, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.addLinkButton}
              onPress={() => logic.ConfirmReturnItem("ADD")}
            >
              <Text style={returnStyles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {/* Barcode scan popup */}
          <Modal
            visible={logic._scanning}
            transparent={true}
            animationType="slide"
            onRequestClose={() => logic.setScanning(false)}
          >
            <View style={returnStyles.modalContainer}>
              <View style={returnStyles.popup}>
                <BarcodeScanner onScan={logic.handleScan} />
                <Button
                  title="Close"
                  onPress={() => logic.setScanning(false)}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        {/* Supplier Search */}
        <View style={returnStyles.row}>
          <View style={returnStyles.cell}>
            <Text style={returnStyles.labelText}>Supplier</Text>
          </View>
          <View style={returnStyles.cell}>
            <TouchableOpacity onPress={() => logic.setsuppModalVisible(true)}>
              <TextInput
                style={returnStyles.valueText}
                value={logic._suppCode}
                editable={false}
                placeholder="Touch to search"
              />
            </TouchableOpacity>
          </View>
          <View style={returnStyles.cell}>
            <TouchableOpacity
              style={returnStyles.addLinkButton}
              onPress={() => logic.GetReturnItemListBySuppCode(logic._suppCode)}
            >
              <Text style={returnStyles.buttonText}>Load</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Supplier popup */}
        <Modal
          visible={logic._suppmodalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => logic.setsuppModalVisible(false)}
        >
          <View style={returnStyles.modalContainer_2}>
            <View style={returnStyles.popup_2}>
              <TextInput
                style={returnStyles.searchInput}
                onChangeText={logic.handleSuppDesChange}
                placeholder="Type to search"
              />
              <FlatList
                data={logic._suppSuggestions}
                keyExtractor={(item) => item.supp_Code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => logic.GetSupplier(item)}
                    style={returnStyles.suggestionItem}
                  >
                    <Text style={returnStyles.suggestionText}>
                      {" "}
                      {item.supp_Code} - {item.supp_Name}
                    </Text>
                  </TouchableOpacity>
                )}
                style={returnStyles.suggestionsList}
              />
              <Button
                title="Close"
                onPress={() => logic.setsuppModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </View>
      <View style={returnStyles.returnGridContainer}>
        <RetunItemListPage
          data={logic._returnItems}
          toggleSelect={logic.toggleSelect}
        />
      </View>
      <View>
        <View style={returnStyles.vw_2}>
          <View style={{ width: 120, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.deleteButton}
              onPress={logic.DeleteItems}
            >
              <Text style={returnStyles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: 150, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.addLinkButton}
              onPress={logic.UpdateItemsAsReturned}
            >
              <Text style={returnStyles.buttonText}>Return</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: 120, padding: 2 }}>
            <TouchableOpacity
              style={returnStyles.scanButton}
              onPress={logic.ProcessSelectedItems}
            >
              <Text style={returnStyles.buttonText}>Process</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReturnPage;
