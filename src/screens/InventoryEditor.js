import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Inventory Wizard</Text>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image 
          // source={require(".../assets/icons/inventory_wizard_icon.png")}
          source={require("../../assets/icons/inventory_wizard_icon.jpg")}
          style={styles.imageStyle} 
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("login")}
        >
          <Text style={styles.buttonText}>Go to Login Screen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("create")}
        >
          <Text style={styles.buttonText}>Go to Create Account Screen</Text>
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

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("pass")}
        >
          <Text style={styles.buttonText}>Go to Forgot Password Screen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("invManager")}
        >
          <Text style={styles.buttonText}>Go to Invoice Manager Screen</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Text */}
      <Text style={styles.bottomText}>Prototype #2</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C48C5", // Deep purple background
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 40, // Space between the top of the screen and title
    marginBottom: 20, // Space between title and image
    textAlign: "center",
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
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 80, // Add bottom padding to ensure space for the bottom text
  },
  button: {
    width: "80%",
    paddingVertical: 16,
    backgroundColor: "#FFF7F7",
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 12, // Space between buttons
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
  bottomText: {
    position: "absolute",
    bottom: 20, // Ensure it stays at the very bottom of the screen
    textAlign: "center",
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default HomeScreen;
