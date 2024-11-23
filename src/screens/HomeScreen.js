import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Inventory Wizard</Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("login")}
      >
        <Text style={styles.buttonText}>Go to Login Screen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("editor")}
      >
        <Text style={styles.buttonText}>Go to Editor Screen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("start_1")}
      >
        <Text style={styles.buttonText}>Go to Start Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("add")}
      >
        <Text style={styles.buttonText}>Go to Add Items Screen</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C48C5", // Deep purple background for contrast
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF", // White title for readability
    marginBottom: 40, // Adds spacing between title and buttons
    textAlign: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 16,
    backgroundColor: "#FFF7F7", // Soft white button background for contrast
    borderRadius: 20, // Increased rounding for a modern feel
    alignItems: "center",
    marginVertical: 12, // Slightly increased spacing between buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Adds a subtle shadow for depth
  },
  buttonText: {
    fontSize: 18, // Slightly larger font for better readability
    color: "#6C48C5", // Matches the background for cohesive design
    fontWeight: "600", // Semi-bold for emphasis
  },
});

export default HomeScreen;
