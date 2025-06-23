import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Iresha Food City",
        }}
      />
      <Stack.Screen
        name="Stock/index"
        options={{
          headerTitle: "Stock",
        }}
      />
      <Stack.Screen
        name="ReturnItem/return"
        options={{
          headerTitle: "Return",
        }}
      />
      <Stack.Screen
        name="PriceLink/PriceLinkPage"
        options={{
          headerTitle: "PriceLink",
        }}
      />
      <Stack.Screen
        name="GRN/index"
        options={{
          headerTitle: "GRN",
        }}
      />
    </Stack>
  );
};

export default RootLayout;
