import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// The app's own start screen. Android 12+ draws its system splash as an icon in a circle, so that one is only the
// plain green (assets/splash.png is empty) and this full screen follows on the same green, then fades to the app.

SplashScreen.preventAutoHideAsync().catch(() => {});

export const START_GREEN = "#1E8E4A";
const SHOW_MS = 1600;
const FOOD = ["🍎", "🥦", "🍞", "🥛", "🍌", "🥕", "🧀"];

const StartScreen = ({ onDone }: { onDone: () => void }) => {
  const fade = useRef(new Animated.Value(1)).current;
  const rise = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.timing(rise, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    const t = setTimeout(() => {
      Animated.timing(fade, { toValue: 0, duration: 350, useNativeDriver: true }).start(() => onDone());
    }, SHOW_MS);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View style={[s.page, { opacity: fade }]} onLayout={() => SplashScreen.hideAsync().catch(() => {})}>
      <View style={s.glowTop} />
      <View style={s.glowBottom} />
      <Animated.View style={[s.center, { transform: [{ translateY: rise }] }]}>
        <View style={s.badge}>
          <Image source={require("../assets/splash-mark.png")} style={s.mark} resizeMode="contain" />
        </View>
        <Text style={s.name}>Iresha Food City</Text>
        <View style={s.rule} />
        <Text style={s.sub}>Shop floor tools</Text>
        <View style={s.foodRow}>
          {FOOD.map((f) => (
            <View key={f} style={s.foodChip}><Text style={s.food}>{f}</Text></View>
          ))}
        </View>
      </Animated.View>
      <Text style={s.footer}>© {new Date().getFullYear()} Powered by Amare</Text>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  page: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: START_GREEN, alignItems: "center", justifyContent: "center", zIndex: 100, overflow: "hidden" },
  // soft light circles for depth
  glowTop: { position: "absolute", width: 420, height: 420, borderRadius: 210, backgroundColor: "#2FAE5E", opacity: 0.45, top: -140, right: -150 },
  glowBottom: { position: "absolute", width: 360, height: 360, borderRadius: 180, backgroundColor: "#14723A", opacity: 0.6, bottom: -120, left: -130 },
  center: { alignItems: "center", paddingHorizontal: 24 },
  badge: {
    width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.14)", borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)", alignItems: "center", justifyContent: "center", marginBottom: 22,
  },
  mark: { width: 190, height: 190 },
  name: { color: "#FFFFFF", fontSize: 32, fontWeight: "bold", letterSpacing: 0.5, textAlign: "center" },
  rule: { width: 56, height: 4, borderRadius: 2, backgroundColor: "#FFC93C", marginVertical: 12 },
  sub: { color: "#D3F2DD", fontSize: 16, letterSpacing: 1 },
  foodRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 30, gap: 8 },
  foodChip: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  food: { fontSize: 22 },
  footer: { position: "absolute", bottom: 36, color: "#D3F2DD", fontSize: 13 },
});

export default StartScreen;
