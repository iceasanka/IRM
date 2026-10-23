import React from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView, Modal, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScanBar, MessageLine, ItemPickers } from "../../components/ItemFinder";
import { C, common } from "../../theme";
import GrnList from "./GrnList.js";
import styles from "./styles.js";
import useGrnPageLogic, { money, qtyText } from "./GrnPageLogic";

// GRN - scan a delivery into the supplier's draft GRN; the back office checks and commits it (new system)
const GrnPage: React.FC = () => {
  const logic = useGrnPageLogic();
  const s = common;
  const it = logic.item;
  // keep the last rows above the Android navigation bar (the app draws edge to edge)
  const navBar = useSafeAreaInsets().bottom;
  const sellDiffers = it && logic.sell !== "" && Math.abs(parseFloat(logic.sell) - (it.retailPrice ?? 0)) >= 0.005;

  return (
    <KeyboardAvoidingView style={s.page} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={60}>
      {/* Supplier */}
      <TouchableOpacity style={s.supplierBar} onPress={() => logic.setSuppModal(true)} activeOpacity={0.8}>
        <View style={{ flex: 1 }}>
          <Text style={s.supplierLabel}>SUPPLIER</Text>
          <Text style={s.supplierName} numberOfLines={1}>
            {logic.supplier ? logic.supplier.suppName : "Touch to select the supplier"}
          </Text>
        </View>
        <View style={s.supplierChange}><Text style={s.supplierChangeText}>{logic.supplier ? "Change" : "Select"}</Text></View>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: 24 + navBar }]} keyboardShouldPersistTaps="handled">
        <ScanBar
          cameraOn={logic.cameraOn} setCameraOn={logic.setCameraOn} code={logic.code} setCode={logic.setCode}
          onScan={logic.handleScan} onFind={() => logic.lookup(logic.code)} onName={() => logic.setDescModal(true)}
        />
        <MessageLine message={logic.message} />

        {/* Scanned item */}
        {it ? (
          <View style={s.card}>
            <Text style={s.itemName}>{it.descrip}</Text>
            <Text style={s.itemCode}>{it.barcode} {it.refCode ? `· ${it.refCode}` : ""}</Text>
            <View style={s.infoRow}>
              <View style={s.infoCell}>
                <Text style={s.infoLabel}>Item cost</Text>
                <Text style={s.infoValue}>{money(it.costPrice)}</Text>
              </View>
              <View style={s.infoCell}>
                <Text style={s.infoLabel}>Item price</Text>
                <Text style={s.infoValue}>{money(it.retailPrice)}</Text>
                {logic.links.length ? <Text style={{ fontSize: 12, color: C.green }}>+ {logic.links.map(money).join(", ")}</Text> : null}
              </View>
              <View style={s.infoCell}>
                <Text style={s.infoLabel}>Stock</Text>
                <Text style={s.infoValue}>{logic.stock == null ? "-" : qtyText(logic.stock)}</Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>Cost price</Text>
                <TextInput style={[s.bigInput, { color: C.green }]} value={logic.cost} onChangeText={logic.setCost} keyboardType="decimal-pad" selectTextOnFocus />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>Selling price</Text>
                <TextInput style={[s.bigInput, { color: C.red }]} value={logic.sell} onChangeText={logic.setSell} keyboardType="decimal-pad" selectTextOnFocus />
              </View>
            </View>
            {sellDiffers ? (
              <Text style={styles.note}>The item still sells at {money(it.retailPrice)} - change it on Price Link (or add a price link for the new stock).</Text>
            ) : null}

            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyButton} onPress={() => logic.changeQty(-1)}><Text style={styles.qtyButtonText}>−</Text></TouchableOpacity>
              <TextInput ref={logic.qtyRef} style={styles.qtyInput} value={logic.qty} onChangeText={logic.setQty} keyboardType="decimal-pad" selectTextOnFocus />
              <TouchableOpacity style={styles.qtyButton} onPress={() => logic.changeQty(1)}><Text style={styles.qtyButtonText}>+</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.addButton, (logic.busy || !logic.supplier) && s.disabled]} onPress={logic.addLine} disabled={logic.busy}>
                <Text style={s.bigButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={logic.clearItem} style={{ marginTop: 8, alignSelf: "flex-end" }}>
              <Text style={{ color: C.primary, fontWeight: "bold" }}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* The draft GRN */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{logic.grnNo ? `${logic.grnNo} (draft)` : "GRN"}</Text>
          {logic.loading ? <ActivityIndicator color={C.primary} style={{ marginLeft: 8 }} /> : null}
          <TouchableOpacity onPress={() => logic.loadLines()} style={{ marginLeft: "auto" }}>
            <Text style={{ color: C.primary, fontWeight: "bold" }}>Refresh</Text>
          </TouchableOpacity>
        </View>
        {logic.lines.length > 0 ? (
          <Text style={styles.listSub}>
            {logic.lines.length} line(s) · qty {qtyText(logic.totalQty)} · <Text style={{ fontWeight: "bold", color: C.primary }}>Rs {money(logic.total)}</Text>
            {"\n"}Open it on GRN Entry in the back office to check and commit it to stock. Touch a line to change it.
          </Text>
        ) : null}
        {logic.supplier ? (
          <GrnList data={logic.lines} onPress={logic.openLine} />
        ) : (
          <Text style={s.hint}>Select the supplier of the delivery.</Text>
        )}
        <Text style={s.footer}>© {new Date().getFullYear()} IRM</Text>
      </ScrollView>

      {/* Change / delete a line */}
      <Modal visible={!!logic.editLine} transparent animationType="fade" onRequestClose={() => logic.setEditLine(null)}>
        <View style={s.modalBack}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>{logic.editLine?.descrip}</Text>
            <View style={styles.priceRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>Qty</Text>
                <TextInput style={s.bigInput} value={logic.edit.qty} onChangeText={(t) => logic.setEdit({ ...logic.edit, qty: t })} keyboardType="decimal-pad" selectTextOnFocus />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>Cost</Text>
                <TextInput style={s.bigInput} value={logic.edit.cost} onChangeText={(t) => logic.setEdit({ ...logic.edit, cost: t })} keyboardType="decimal-pad" selectTextOnFocus />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>Selling</Text>
                <TextInput style={s.bigInput} value={logic.edit.sell} onChangeText={(t) => logic.setEdit({ ...logic.edit, sell: t })} keyboardType="decimal-pad" selectTextOnFocus />
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: C.red }, logic.busy && s.disabled]} onPress={logic.deleteLine} disabled={logic.busy}>
                <Text style={s.bigButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: C.muted }]} onPress={() => logic.setEditLine(null)}>
                <Text style={s.bigButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, logic.busy && s.disabled]} onPress={logic.saveLine} disabled={logic.busy}>
                <Text style={s.bigButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

      <ItemPickers
        descModal={logic.descModal} setDescModal={logic.setDescModal} descResults={logic.descResults}
        searchByDescription={logic.searchByDescription} pickDescription={logic.pickDescription}
        choices={logic.choices} setChoices={logic.setChoices} pickItem={logic.pickItem}
      />
    </KeyboardAvoidingView>
  );
};

export default GrnPage;
