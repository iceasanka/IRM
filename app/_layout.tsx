import { Stack } from "expo-router";
import React from "react";
import { headerOptions } from "../theme";

// every screen: indigo header (same colours as the back office)
const RootLayout = () => {
  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "IRM",
          headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
        }}
      />
      <Stack.Screen name="Stock/index" options={{ headerTitle: "Stock" }} />
      <Stack.Screen name="ReturnItem/return" options={{ headerTitle: "Return Stock" }} />
      <Stack.Screen name="PriceLink/PriceLinkPage" options={{ headerTitle: "Price Link" }} />
      <Stack.Screen name="GRN/index" options={{ headerTitle: "GRN" }} />
    </Stack>
  );
};

export default RootLayout;
