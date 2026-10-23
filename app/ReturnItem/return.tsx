import React from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BarcodeScanner from "../../BarcodeScanner_2.js";
import RetunItemListPage from "./RetunItemListPage.js";
import returnStyles, { C } from "./returnStyles.js";
import useReturnPageLogic, { REASONS } from "./useReturnPageLogic";

// Return Stock - scan items into the supplier's return list (new system, same list as the back office Return Items page)
const ReturnPage = () => {
  const logic = useReturnPageLogic();
  const s = returnStyles;
  // keep the bottom buttons above the Android navigation bar (the app draws edge to edge)
  const navBar = useSafeAreaInsets().bottom;
  const anySel = logic.selRows.length > 0;
  const allReady = anySel && logic.selRows.every((r) => r.status === 2);

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Supplier */}
      <TouchableOpacity style={s.supplierBar} onPress={() => logic.setSuppModal(true)} activeOpacity={0.8}>
        <View style={{ flex: 1 }}>
          <Text style={s.supplierLabel}>SUPPLIER</Text>
          <Text style={s.supplierName} numberOfLines={1}>
            {logic.supplier ? `${logic.supplier.suppName}` : "Touch to select the supplier"}
          </Text>
        </View>
        <View style={s.supplierChange}><Text style={s.supplierChangeText}>{logic.supplier ? "Change" : "Select"}</Text></View>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: 90 + navBar }]} keyboardShouldPersistTaps="handled">
        {/* Camera */}
        {logic.cameraOn && (
          <View style={s.cameraBox}>
            <BarcodeScanner onScan={logic.handleScan} />
          </View>
        )}

        {/* Typed code / description */}
        <View style={s.scanRow}>
          <TextInput
            style={s.codeInput}
            value={logic.code}
            onChangeText={logic.setCode}
            placeholder="Barcode / code"
            placeholderTextColor={C.muted}
            autoCapitalize="characters"
            returnKeyType="search"
            onSubmitEditing={() => logic.lookup(logic.code)}
          />
          <TouchableOpacity style={s.smallButton} onPress={() => logic.lookup(logic.code)}>
            <Text style={s.smallButtonText}>Find</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.smallButtonOutline} onPress={() => logic.setDescModal(true)}>
            <Text style={s.smallButtonOutlineText}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.smallButtonOutline} onPress={() => logic.setCameraOn(!logic.cameraOn)}>
            <Text style={s.smallButtonOutlineText}>{logic.cameraOn ? "Cam off" : "Cam on"}</Text>
          </TouchableOpacity>
        </View>

        {logic.message ? (
          <Text style={[s.message, logic.message.ok ? s.messageOk : s.messageErr]}>{logic.message.text}</Text>
        ) : null}

        {/* Scanned item */}
        {logic.item ? (
          <View style={s.card}>
            <Text style={s.itemName}>{logic.item.descrip}</Text>
            <Text style={s.itemCode}>{logic.item.barcode} {logic.item.refCode ? `· ${logic.item.refCode}` : ""}</Text>
            <View style={s.infoRow}>
              <View style={s.infoCell}>
                <Text style={s.infoLabel}>Cost</Text>
                <Text style={s.infoValue}>{(logic.item.costPrice ?? 0).toFixed(2)}</Text>
              </View>
              <View style={s.infoCell}>
                <Text style={s.infoLabel}>Retail</Text>
                <Text style={s.infoValue}>{(logic.item.retailPrice ?? 0).toFixed(2)}</Text>
              </View>
              <View style={s.infoCell}>
                <Text style={s.infoLabel}>Stock</Text>
                <Text style={[s.infoValue, logic.item.stockQty > 0 ? s.stockOk : s.stockBad]}>{logic.item.stockQty}</Text>
              </View>
            </View>
            <View style={s.chips}>
              {REASONS.map((r) => (
                <TouchableOpacity key={r} style={[s.chip, logic.reason === r && s.chipOn]} onPress={() => logic.setReason(r)}>
                  <Text style={[s.chipText, logic.reason === r && s.chipTextOn]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={s.qtyRow}>
              <TouchableOpacity style={s.qtyButton} onPress={() => logic.changeQty(-1)}><Text style={s.qtyButtonText}>−</Text></TouchableOpacity>
              <TextInput
                ref={logic.qtyRef}
                style={s.qtyInput}
                value={logic.qty}
                onChangeText={logic.setQty}
                keyboardType="numeric"
                selectTextOnFocus
              />
              <TouchableOpacity style={s.qtyButton} onPress={() => logic.changeQty(1)}><Text style={s.qtyButtonText}>+</Text></TouchableOpacity>
              <TouchableOpacity style={[s.addButton, (logic.busy || !logic.supplier) && s.barDisabled]} onPress={logic.addItem} disabled={logic.busy}>
                <Text style={s.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={logic.clearItem} style={{ marginTop: 8, alignSelf: "flex-end" }}>
              <Text style={{ color: C.primary, fontWeight: "bold" }}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Return list of this supplier */}
        <View style={s.listHeader}>
          <Text style={s.listTitle}>
            Return list {logic.rows.length ? `(${logic.rows.length}, ${logic.readyCount} ready)` : ""}
          </Text>
          {logic.loading ? <ActivityIndicator color={C.primary} style={{ marginLeft: 8 }} /> : null}
          <Text style={s.listTotal}>Rs {logic.total.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 14, marginBottom: 6 }}>
          <TouchableOpacity onPress={logic.selectAll}><Text style={{ color: C.primary, fontWeight: "bold" }}>Select all</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => logic.loadList()}><Text style={{ color: C.primary, fontWeight: "bold" }}>Refresh</Text></TouchableOpacity>
        </View>
        {logic.supplier ? (
          <RetunItemListPage data={logic.rows} selected={logic.selected} toggleSelect={logic.toggleSelect} />
        ) : (
          <Text style={{ textAlign: "center", color: C.muted, padding: 16 }}>Select the supplier to see its return list.</Text>
        )}
      </ScrollView>

      {/* Actions */}
      <View style={[s.bottomBar, { paddingBottom: 8 + navBar }]}>
        <TouchableOpacity style={[s.barButton, s.barDelete, (!anySel || logic.busy) && s.barDisabled]} onPress={logic.deleteSelected} disabled={logic.busy}>
          <Text style={s.barButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.barButton, s.barReady, (!anySel || logic.busy) && s.barDisabled]} onPress={logic.toggleReady} disabled={logic.busy}>
          <Text style={s.barButtonText}>{allReady ? "Not ready" : "Ready"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.barButton, s.barProcess, (logic.readyCount === 0 || logic.busy) && s.barDisabled]} onPress={logic.processReady} disabled={logic.busy}>
          <Text style={s.barButtonText}>Process</Text>
        </TouchableOpacity>
      </View>

      {/* Supplier popup */}
      <Modal visible={logic.suppModal} transparent animationType="slide" onRequestClose={() => logic.setSuppModal(false)}>
        <View style={s.modalBack}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Select the supplier</Text>
            <TextInput style={s.searchInput} autoFocus onChangeText={logic.searchSupplier} placeholder="Type the supplier name" placeholderTextColor={C.muted} />
            <FlatList
              data={logic.suppResults}
              keyExtractor={(x) => String(x.suppId)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => logic.pickSupplier(item)} style={s.suggestionItem}>
                  <Text style={s.suggestionText}>{item.suppName}</Text>
                  <Text style={s.suggestionSub}>{item.suppCode}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={s.modalClose} onPress={() => logic.setSuppModal(false)}>
              <Text style={s.smallButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Item by name popup */}
      <Modal visible={logic.descModal} transparent animationType="slide" onRequestClose={() => logic.setDescModal(false)}>
        <View style={s.modalBack}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Find the item by name</Text>
            <TextInput style={s.searchInput} autoFocus onChangeText={logic.searchByDescription} placeholder="Type 3 letters or more" placeholderTextColor={C.muted} />
            <FlatList
              data={logic.descResults}
              keyExtractor={(x) => String(x.itemId)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => logic.pickDescription(item)} style={s.suggestionItem}>
                  <Text style={s.suggestionText}>{item.descrip}</Text>
                  <Text style={s.suggestionSub}>{item.barcode || item.refCode}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={s.modalClose} onPress={() => logic.setDescModal(false)}>
              <Text style={s.smallButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* More than one item for a code */}
      <Modal visible={logic.choices.length > 1} transparent animationType="fade" onRequestClose={() => logic.setChoices([])}>
        <View style={s.modalBack}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>{logic.choices.length} items match - pick one</Text>
            <FlatList
              data={logic.choices}
              keyExtractor={(x) => String(x.itemId)}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => logic.pickItem(item)} style={s.suggestionItem}>
                  <Text style={s.suggestionText}>{item.descrip}</Text>
                  <Text style={s.suggestionSub}>{item.barcode} {item.refCode}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={s.modalClose} onPress={() => logic.setChoices([])}>
              <Text style={s.smallButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ReturnPage;
