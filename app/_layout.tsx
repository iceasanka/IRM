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
        name="Stock/return"
        options={{
          headerTitle: "Return",
        }}
      />
      <Stack.Screen
        name="Stock/PriceLinkPage"
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
