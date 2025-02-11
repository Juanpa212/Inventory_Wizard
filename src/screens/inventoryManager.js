import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const InventoryManagerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { inventoryId } = route.params; // Get the inventoryId from navigation params

  const [inventory, setInventory] = useState(null);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('MainDB.db');
        setDb(database);
        fetchInventory(database);
      } catch (error) {
        console.error("Database setup error:", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };

    setupDatabase();
  }, []);

  const fetchInventory = async (database) => {
    try {
      const result = await database.getAllAsync(
        'SELECT * FROM Inventory WHERE id = ?',
        [inventoryId]
      );
      if (result && result.length > 0) {
        setInventory(result[0]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      Alert.alert("Error", "Failed to load inventory details.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Inventory Name and Description at the Top */}
      <View style={styles.header}>
        <Text style={styles.title}>{inventory ? inventory.name : "Inventory Manager"}</Text>
        <Text style={styles.description}>
          {inventory?.description || "No description available"}
        </Text>
      </View>

      {/* 4-Button Grid in the Middle */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("invViewer", { inventoryId })}
        >
          <MaterialCommunityIcons name="eye" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Manage Inventory</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("itemManager", { inventoryId })}
        >
          <MaterialCommunityIcons name="package-variant" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Manage Items</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("invoiceManager")}
        >
          <MaterialCommunityIcons name="file-document" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Manage Invoices</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("stock", { inventoryId })}
        >
          <MaterialCommunityIcons name="chart-line" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Check Stock Levels</Text>
        </TouchableOpacity>
      </View>

      {/* Help Button at the Bottom */}
      <TouchableOpacity 
        style={[styles.helpButton, { backgroundColor: '#6C48C5' }]}
        onPress={() => navigation.navigate("help")}
      >
        <Text style={styles.buttonText}>Help</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  header: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C48C5',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, // Adjust this value to center the buttons vertically
  },
  buttonContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 16,
    margin: 8,
    width: '45%', // Adjust width for a 2x2 grid
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF7F7',
    fontSize: 16,
    marginTop: 8,
  },
  helpButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default InventoryManagerScreen;