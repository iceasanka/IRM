import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateApiHostPortFromStorage } from "../api"; // adjust path if needed

const HomePage = () => {
  const [ip, setIp] = useState("192.168.1.5");
  const [port, setPort] = useState("5000");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // Load saved values if any
    (async () => {
      const savedIp = await AsyncStorage.getItem("api_ip");
      const savedPort = await AsyncStorage.getItem("api_port");
      if (savedIp) setIp(savedIp);
      if (savedPort !== null) setPort(savedPort);
      await updateApiHostPortFromStorage();
    })();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem("api_ip", ip.trim());
    await AsyncStorage.setItem("api_port", port.trim());
    await updateApiHostPortFromStorage();
    setSaveMessage("Saved!");
    setTimeout(() => setSaveMessage(""), 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.settingsBox}>
          <Text style={styles.label}>IP Address or URL</Text>
          <TextInput
            style={styles.input}
            value={ip}
            onChangeText={setIp}
            placeholder="e.g. 192.168.1.5 or https://your-tunnel.trycloudflare.com"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.label}>Port (leave blank if none)</Text>
          <TextInput
            style={styles.input}
            value={port}
            onChangeText={setPort}
            placeholder="Port"
            keyboardType="numeric"
          />
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
          {saveMessage ? (
            <Text style={styles.savedMessage}>{saveMessage}</Text>
          ) : null}
        </View>
        <View style={styles.buttonGroupContainer}>
          <Pressable
            style={styles.menuButton}
            onPress={() => router.push("/Stock")}
          >
            <Text style={styles.buttonText}>Stock</Text>
          </Pressable>
          <Pressable
            style={styles.menuButton}
            onPress={() => router.push("/ReturnItem/return")}
          >
            <Text style={styles.buttonText}>Return Stock</Text>
          </Pressable>
          <Pressable
            style={styles.menuButton}
            onPress={() => router.push("/PriceLink/PriceLinkPage")}
          >
            <Text style={styles.buttonText}>Price Link</Text>
          </Pressable>
          <Pressable
            style={styles.menuButton}
            onPress={() => router.push("/GRN")}
          >
            <Text style={styles.buttonText}>GRN</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fa",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  savedMessage: {
    marginTop: 10,
    color: "#28a745",
    fontWeight: "bold",
  },
  settingsBox: {
    width: "90%",
    backgroundColor: "#ffffffff",
    borderRadius: 0,
    padding: 5,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#f6f8fa",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  buttonGroupContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonGroup: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    gap: 18, // vertical spacing between buttons (RN 0.71+)
  },
  menuButton: {
    backgroundColor: "#28a745",
    paddingVertical: 18,
    paddingHorizontal: 24,
    //  borderRadius: 16,
    width: "90%",
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default HomePage;
