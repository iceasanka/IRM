import React from "react";
import {
  Text,
  View,
  TextInput,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BarcodeScanner from "../../BarcodeScanner_2.js";
import styles, { C } from "./PriceLinkPageStyles.js";
import usePriceLinkPageLogic, { money } from "./PriceLinkPageLogic";

const fmtDate = (s?: string) => {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

// Price Link - scan an item, change its normal retail price, add / delete extra prices (new system)
const PriceLinkPage = () => {
  const logic = usePriceLinkPageLogic();
  const s = styles;
  const it = logic.item;
  // keep the last fields above the Android navigation bar (the app draws edge to edge)
  const navBar = useSafeAreaInsets().bottom;

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={60}>
      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: 24 + navBar }]} keyboardShouldPersistTaps="handled">
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

        {!it ? (
          <Text style={s.hint}>Scan or find an item to see and change its prices.</Text>
        ) : (
          <>
            {/* Item */}
            <View style={s.card}>
              <Text style={s.itemName}>{it.descrip}</Text>
              <Text style={s.itemCode}>{it.barcode} {it.refCode ? `· ${it.refCode}` : ""}</Text>
              <View style={s.infoRow}>
                <View style={s.infoCell}>
                  <Text style={s.infoLabel}>Cost</Text>
                  <Text style={s.infoValue}>{money(it.costPrice)}</Text>
                </View>
                <View style={s.infoCell}>
                  <Text style={s.infoLabel}>Wholesale</Text>
                  <Text style={s.infoValue}>{money(it.wholesalePrice)}</Text>
                </View>
                <View style={s.infoCell}>
                  <Text style={s.infoLabel}>MRP</Text>
                  <Text style={s.infoValue}>{it.maxPrice ? money(it.maxPrice) : "-"}</Text>
                </View>
              </View>

              {/* Normal retail price */}
              <Text style={s.sectionTitle}>RETAIL PRICE</Text>
              <View style={s.priceRow}>
                <TextInput
                  style={s.priceInput}
                  value={logic.retPrice}
                  onChangeText={logic.setRetPrice}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                />
                <TouchableOpacity style={[s.bigButton, logic.busy && s.disabled]} onPress={logic.saveRetailPrice} disabled={logic.busy}>
                  <Text style={s.bigButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Prices on the till */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 6 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: C.text }}>Prices on the till</Text>
              {logic.loading ? <ActivityIndicator color={C.primary} style={{ marginLeft: 8 }} /> : null}
            </View>
            <View style={s.table}>
              <View style={[s.row, s.header]}>
                <Text style={[s.colPrice, s.headerText]}>Price</Text>
                <Text style={[s.colRemark, s.headerText]}>Remark</Text>
                <View style={s.colAction} />
              </View>
              <View style={[s.row, s.normalRow]}>
                <Text style={s.colPrice}>{money(it.retailPrice)}</Text>
                <Text style={s.colRemark}>Normal price</Text>
                <View style={s.colAction}><Text style={s.normalTag}>ITEM</Text></View>
              </View>
              {logic.links.length === 0 && !logic.loading ? (
                <Text style={s.empty}>No price links - the till uses the normal price.</Text>
              ) : (
                logic.links.map((l) => (
                  <View key={l.priceLinkId} style={s.row}>
                    <Text style={s.colPrice}>{money(l.retailPrice)}</Text>
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                      <Text style={{ fontSize: 13, color: C.text }}>{l.remark || "Price link"}</Text>
                      <Text style={s.colDate}>{fmtDate(l.cDate)}</Text>
                    </View>
                    <View style={s.colAction}>
                      <TouchableOpacity style={[s.deleteButton, logic.busy && s.disabled]} onPress={() => logic.deleteLink(l)} disabled={logic.busy}>
                        <Text style={s.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* New price link */}
            <View style={s.card}>
              <Text style={[s.sectionTitle, { marginTop: 0 }]}>ADD A PRICE LINK</Text>
              <View style={s.priceRow}>
                <TextInput
                  ref={logic.newPriceRef}
                  style={[s.priceInput, { color: C.text }]}
                  value={logic.newPrice}
                  onChangeText={logic.setNewPrice}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={C.muted}
                />
                <TouchableOpacity style={[s.bigButton, s.bigButtonGreen, logic.busy && s.disabled]} onPress={logic.addLink} disabled={logic.busy}>
                  <Text style={s.bigButtonText}>Add Link</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={s.remarkInput}
                value={logic.newRemark}
                onChangeText={logic.setNewRemark}
                placeholder="Remark (optional) e.g. Old stock"
                placeholderTextColor={C.muted}
                maxLength={50}
              />
            </View>

            <TouchableOpacity style={s.clearButton} onPress={logic.clearForm}>
              <Text style={s.clearText}>Clear</Text>
            </TouchableOpacity>
          </>
        )}
        <Text style={s.footer}>© {new Date().getFullYear()} IRM</Text>
      </ScrollView>

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
                  <Text style={s.suggestionSub}>{item.barcode || item.refCode} · {money(item.retailPrice)}</Text>
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
                  <Text style={s.suggestionSub}>{item.barcode} {item.refCode} · {money(item.retailPrice)}</Text>
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

export default PriceLinkPage;
