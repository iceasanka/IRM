import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList } from "react-native";
import BarcodeScanner from "../BarcodeScanner_2.js";
import { C, common as s } from "../theme";

const money = (n?: number | null) => (n == null ? "" : Number(n).toFixed(2));

// Camera + typed code with Find / Name / Cam buttons (Stock, GRN pages)
export const ScanBar = ({ cameraOn, setCameraOn, code, setCode, onScan, onFind, onName }: {
  cameraOn: boolean; setCameraOn: (v: boolean) => void; code: string; setCode: (v: string) => void;
  onScan: (data: string) => void; onFind: () => void; onName: () => void;
}) => (
  <>
    {cameraOn && (
      <View style={s.cameraBox}>
        <BarcodeScanner onScan={onScan} />
      </View>
    )}
    <View style={s.scanRow}>
      <TextInput
        style={s.codeInput}
        value={code}
        onChangeText={setCode}
        placeholder="Barcode / code"
        placeholderTextColor={C.muted}
        autoCapitalize="characters"
        returnKeyType="search"
        onSubmitEditing={onFind}
      />
      <TouchableOpacity style={s.smallButton} onPress={onFind}>
        <Text style={s.smallButtonText}>Find</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.smallButtonOutline} onPress={onName}>
        <Text style={s.smallButtonOutlineText}>Name</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.smallButtonOutline} onPress={() => setCameraOn(!cameraOn)}>
        <Text style={s.smallButtonOutlineText}>{cameraOn ? "Cam off" : "Cam on"}</Text>
      </TouchableOpacity>
    </View>
  </>
);

// Green / red message line
export const MessageLine = ({ message }: { message: { text: string; ok: boolean } | null }) =>
  message ? <Text style={[s.message, message.ok ? s.messageOk : s.messageErr]}>{message.text}</Text> : null;

// "Find the item by name" popup and the "more than one item for this code" popup
export const ItemPickers = ({ descModal, setDescModal, descResults, searchByDescription, pickDescription, choices, setChoices, pickItem }: {
  descModal: boolean; setDescModal: (v: boolean) => void; descResults: any[]; searchByDescription: (t: string) => void;
  pickDescription: (it: any) => void; choices: any[]; setChoices: (v: any[]) => void; pickItem: (it: any) => void;
}) => (
  <>
    <Modal visible={descModal} transparent animationType="slide" onRequestClose={() => setDescModal(false)}>
      <View style={s.modalBack}>
        <View style={s.modalBox}>
          <Text style={s.modalTitle}>Find the item by name</Text>
          <TextInput style={s.searchInput} autoFocus onChangeText={searchByDescription} placeholder="Type 3 letters or more" placeholderTextColor={C.muted} />
          <FlatList
            data={descResults}
            keyExtractor={(x) => String(x.itemId)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => pickDescription(item)} style={s.suggestionItem}>
                <Text style={s.suggestionText}>{item.descrip}</Text>
                <Text style={s.suggestionSub}>{item.barcode || item.refCode} · {money(item.retailPrice)}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={s.modalClose} onPress={() => setDescModal(false)}>
            <Text style={s.smallButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    <Modal visible={choices.length > 1} transparent animationType="fade" onRequestClose={() => setChoices([])}>
      <View style={s.modalBack}>
        <View style={s.modalBox}>
          <Text style={s.modalTitle}>{choices.length} items match - pick one</Text>
          <FlatList
            data={choices}
            keyExtractor={(x) => String(x.itemId)}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => pickItem(item)} style={s.suggestionItem}>
                <Text style={s.suggestionText}>{item.descrip}</Text>
                <Text style={s.suggestionSub}>{item.barcode} {item.refCode} · {money(item.retailPrice)}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={s.modalClose} onPress={() => setChoices([])}>
            <Text style={s.smallButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </>
);
