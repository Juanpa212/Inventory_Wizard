import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Inventory Wizard</Text>
      {/* Image */}

      <View style={styles.imageContainer}>
        <Image 
          source={require("../../assets/icons/inventory_wizard_icon.jpg")}
          style={styles.imageStyle} 
        />
      </View>
      

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("inventory")}
      >

        <Text style={styles.buttonText}>Create Inventory</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("allInv")}
      >
        <Text style={styles.buttonText}>View Inventories</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C48C5", 
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF", 
    marginBottom: 50, 
    textAlign: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 16,
    backgroundColor: "#FFF7F7",
    borderRadius: 20, 
    alignItems: "center",
    marginVertical: 12, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  buttonText: {
    fontSize: 18,
    color: "#6C48C5",
    fontWeight: "600", 
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20, // Space between image and buttons
  },
  imageStyle: {
    height: 150,
    width: 150,
    resizeMode: "contain", // Ensure the image retains its aspect ratio
  },
});

export default StartScreen;
