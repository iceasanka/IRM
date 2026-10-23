import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateApiHostPortFromStorage, apiBaseUrl, syncTerminals } from "../api";
import { C } from "../theme";

// The four jobs of the app, all on the new system (same data as the back office)
const TILES = [
  { path: "/Stock", letter: "S", title: "Stock", sub: "See, count, add or remove stock", color: C.primary },
  { path: "/GRN", letter: "G", title: "GRN", sub: "Scan a delivery for the office", color: C.green },
  { path: "/ReturnItem/return", letter: "R", title: "Return Stock", sub: "Items going back to a supplier", color: C.red },
  { path: "/PriceLink/PriceLinkPage", letter: "P", title: "Price Link", sub: "Item price and extra prices", color: C.blue },
] as const;

type Conn = { state: "checking" } | { state: "ok"; tills: number } | { state: "down"; error: string };

const HomePage = () => {
  const [ip, setIp] = useState("192.168.1.5");
  const [port, setPort] = useState("5000");
  const [url, setUrl] = useState("");
  const [conn, setConn] = useState<Conn>({ state: "checking" });
  const [editing, setEditing] = useState(false);
  const navBar = useSafeAreaInsets().bottom;

  // is the server there? (the till list is small and needs no sign-in)
  const check = async () => {
    setUrl(apiBaseUrl());
    setConn({ state: "checking" });
    try {
      const res = await syncTerminals();
      setConn({ state: "ok", tills: (res.data || []).filter((t: any) => t.status === 1).length });
    } catch (e: any) {
      setConn({ state: "down", error: e?.message || "No answer" });
    }
  };

  useEffect(() => {
    (async () => {
      const savedIp = await AsyncStorage.getItem("api_ip");
      const savedPort = await AsyncStorage.getItem("api_port");
      if (savedIp) setIp(savedIp);
      if (savedPort !== null) setPort(savedPort);
      await updateApiHostPortFromStorage();
      check();
    })();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem("api_ip", ip.trim());
    await AsyncStorage.setItem("api_port", port.trim());
    await updateApiHostPortFromStorage();
    await check();
    setEditing(false);
  };

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 24 + navBar }]} keyboardShouldPersistTaps="handled">
        {/* Brand */}
        <View style={styles.brand}>
          <Text style={styles.brandName}>Iresha Food City</Text>
          <Text style={styles.brandSub}>Shop floor tools</Text>
        </View>

        {/* Jobs */}
        <View style={styles.grid}>
          {TILES.map((t) => (
            <Pressable key={t.path} style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]} onPress={() => router.push(t.path)}>
              <View style={[styles.badge, { backgroundColor: t.color }]}>
                <Text style={styles.badgeText}>{t.letter}</Text>
              </View>
              <Text style={styles.tileTitle}>{t.title}</Text>
              <Text style={styles.tileSub}>{t.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* Server */}
        <View style={styles.server}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {conn.state === "checking" ? (
              <ActivityIndicator size="small" color={C.primary} />
            ) : (
              <View style={[styles.dot, { backgroundColor: conn.state === "ok" ? C.green : C.red }]} />
            )}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.serverState}>
                {conn.state === "checking" ? "Checking the server..." : conn.state === "ok"
                  ? `Connected${conn.tills ? ` · ${conn.tills} till(s)` : ""}` : "Server not reachable"}
              </Text>
              <Text style={styles.serverUrl} numberOfLines={1}>{url}</Text>
              {conn.state === "down" ? <Text style={styles.serverErr} numberOfLines={2}>{conn.error}</Text> : null}
            </View>
            <Pressable style={styles.linkButton} onPress={check}><Text style={styles.linkText}>Test</Text></Pressable>
            <Pressable style={styles.linkButton} onPress={() => setEditing(!editing)}><Text style={styles.linkText}>{editing ? "Close" : "Change"}</Text></Pressable>
          </View>

          {editing ? (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>IP address or URL</Text>
              <TextInput
                style={styles.input}
                value={ip}
                onChangeText={setIp}
                placeholder="192.168.1.5 or https://your-tunnel.trycloudflare.com"
                placeholderTextColor={C.muted}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.label}>Port (empty for a URL)</Text>
              <TextInput style={styles.input} value={port} onChangeText={setPort} placeholder="5000" placeholderTextColor={C.muted} keyboardType="numeric" />
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save and test</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <Text style={styles.footer}>© {new Date().getFullYear()} Powered by Amare</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.page },
  scroll: { padding: 14 },

  brand: { backgroundColor: C.primary, paddingVertical: 18, paddingHorizontal: 16, marginBottom: 14 },
  brandName: { color: C.white, fontSize: 26, fontWeight: "bold", letterSpacing: 0.5 },
  brandSub: { color: C.sky, fontSize: 14, fontWeight: "600", marginTop: 2 },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
  tile: {
    width: "48.5%", minHeight: 150, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, padding: 14,
    justifyContent: "flex-start",
  },
  tilePressed: { backgroundColor: C.primarySoft, borderColor: C.primary },
  badge: { width: 46, height: 46, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  badgeText: { color: C.white, fontSize: 24, fontWeight: "bold" },
  tileTitle: { fontSize: 19, fontWeight: "bold", color: C.text },
  tileSub: { fontSize: 13, color: C.muted, marginTop: 4 },

  server: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, padding: 12, marginTop: 14 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  serverState: { fontSize: 15, fontWeight: "bold", color: C.text },
  serverUrl: { fontSize: 12, color: C.muted, marginTop: 1 },
  serverErr: { fontSize: 11, color: C.red, marginTop: 2 },
  linkButton: { paddingHorizontal: 8, paddingVertical: 6 },
  linkText: { color: C.primary, fontWeight: "bold", fontSize: 14 },
  label: { fontSize: 13, fontWeight: "bold", color: C.text, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: C.border, backgroundColor: C.white, paddingHorizontal: 10, height: 46, fontSize: 16,
    color: C.text, marginBottom: 10,
  },
  saveButton: { height: 48, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" },
  saveText: { color: C.white, fontSize: 17, fontWeight: "bold" },

  footer: { textAlign: "center", color: C.muted, fontSize: 12, marginTop: 18 },
});

export default HomePage;
