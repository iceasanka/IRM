import { router } from "expo-router";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.addLinkButton}
        onPress={() => router.push("/Stock")}
      >
        <Text style={styles.buttonText}>Add/Update Stock</Text>
      </Pressable>

      <Pressable
        style={styles.addLinkButton}
        onPress={() => router.push("/Stock/return")}
      >
        <Text style={styles.buttonText}>Return Stock</Text>
      </Pressable>

      <Pressable
        style={styles.addLinkButton}
        onPress={() => router.push("/Stock/PriceLinkPage")}
      >
        <Text style={styles.buttonText}>Price Link</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 10,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  clearButton: {
    width: 100, // Fixed width
    height: 50, // Fixed height
    backgroundColor: "#DC3545", // Background color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10, // Rounded corners
  },
  buttonText: {
    color: "white", // Text color
    fontSize: 16, // Text size
    fontWeight: "bold", // Text weight
  },
  addLinkButton: {
    backgroundColor: "#28a745", // Green background
    padding: 10, // Padding
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
    width: "70%", // Fixed width
    marginBottom: 10, // Space between buttons
  },
  deleteButton: {
    backgroundColor: "#DC3545", // Red background
    padding: 10, // Padding
    borderRadius: 5, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomePage;
