import { Stack } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { headerOptions } from "../theme";
import StartScreen from "../components/StartScreen";

// every screen: indigo header (same colours as the back office); the start screen on top when the app opens
const RootLayout = () => {
  const [starting, setStarting] = useState(true);
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={headerOptions}>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Iresha Food City",
            headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
          }}
        />
        <Stack.Screen name="Stock/index" options={{ headerTitle: "Stock" }} />
        <Stack.Screen name="ReturnItem/return" options={{ headerTitle: "Return Stock" }} />
        <Stack.Screen name="PriceLink/PriceLinkPage" options={{ headerTitle: "Price Link" }} />
        <Stack.Screen name="GRN/index" options={{ headerTitle: "GRN" }} />
      </Stack>
      {starting && <StartScreen onDone={() => setStarting(false)} />}
    </View>
  );
};

export default RootLayout;
