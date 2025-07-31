import { router } from "expo-router";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";

const HomePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
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
    borderRadius: 16,
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
