import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Inventory Wizard</Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("createInventory")}
      >
        <Text style={styles.buttonText}>Create Inventory</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("manageInventory")}
      >
        <Text style={styles.buttonText}>Manage Inventory</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C48C5", // Purple background
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF", // White title for contrast
    marginBottom: 50, // Spacing between title and buttons
    textAlign: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 16,
    backgroundColor: "#FFF7F7", // Light button background
    borderRadius: 20, // Smooth rounded edges
    alignItems: "center",
    marginVertical: 12, // Space between buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Subtle shadow for depth
  },
  buttonText: {
    fontSize: 18,
    color: "#6C48C5", // Purple text to match the theme
    fontWeight: "600", // Semi-bold text
  },
});

export default StartScreen;
