import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";

// Open the database
const db = SQLite.openDatabase("MainDB.db");

// Function to create the table
const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Users (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT,
        EmailOrPhoneNumber TEXT,
        Password TEXT
      );`,
      [],
      () => console.log("Table created successfully"),
      (_, error) => console.log("Error creating table:", error)
    );
  });
};

const InventoryEditor = () => {
  // Ensure the database and table are initialized
  useEffect(() => {
    createTable();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.employeeViewButton}>
          <Text style={styles.employeeViewText}>Employee View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Inventory Manager</Text>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search inventory..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
        <MaterialIcons name="search" size={24} color="#6C48C5" />
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="pen" size={24} color="#6C48C5" />
          <Text style={styles.buttonText}>Manage Items</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="file-invoice" size={24} color="#6C48C5" />
          <Text style={styles.buttonText}>Manage Invoices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="bar-chart-outline" size={24} color="#6C48C5" />
          <Text style={styles.buttonText}>Check Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="information-circle-outline" size={24} color="#6C48C5" />
          <Text style={styles.buttonText}>Stock Analysis</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="home-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome5 name="boxes" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Items</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="receipt-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Invoices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C48C5",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  employeeViewButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  employeeViewText: {
    fontSize: 14,
    color: "#6C48C5",
  },
  helpButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6C48C5",
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#4B2E83",
    borderRadius: 20,
    marginTop: 150,
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 4,
  },
});

export default InventoryEditor;
