import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image, FlatList } from "react-native";

const HomeScreen = ({ navigation }) => {
  // Data for FlatList
  const navigationData = [
    { id: "1", title: "Go to Start Screen", screen: "start_1" },
    { id: "2", title: "Go to Login Screen", screen: "login" },
    { id: "3", title: "Go to Create Account Screen", screen: "create" },
    { id: "4", title: "Go to Forgot Password Screen", screen: "forgotPassword" },
    { id: "5", title: "Go to Create Inventory Screen", screen: "inventory"},
    { id: "6", title: "Go to Edit Iventory Screen", screen: "editInventory" },
    { id: "7", title: "Go to Inventory Manager Screen", screen: "inventoryManager"},
    { id: "8", title: "Go to Inventory Viewer Screen", screen: "invViewer"},
    { id: "9", title: "Go to Add Items Screen", screen: "add" },
    { id: "10", title: "Go to Edit Items Screen", sreen: "editItem"},
    { id: "11", title: "Go to Invoice Manager Screen", screen: "invoiceManager" },
    { id: "12", title: "Go to Create Invoice Screen", screen: "createInvoice"},
    { id: "13", title: "Go to Help Center Screen", screen: "help"},
    { id: "14", title: "Go to Stock Levels Screen", screen: "stock"},  
    { id: "15", title: "Go to Team Viewer Screen", screen: "teamViewer"},




  ];

  // Render each button
  const renderButton = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Text style={styles.buttonText}>{item.title}</Text>
    </TouchableOpacity>
  );

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

      {/* Navigation Buttons */}
      <FlatList
        data={navigationData}
        renderItem={renderButton}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.buttonsContainer}
        showsVerticalScrollIndicator={false} // Hide scroll indicator
      />

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
    alignItems: "center", // Center-align all buttons
    paddingBottom: 80, // Add bottom padding to ensure space for bottom text
  },
  button: {
    width: 350,
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
