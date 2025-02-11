import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const InventoryViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { inventoryId } = route.params;

  const [inventory, setInventory] = useState(null);
  const [items, setItems] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('MainDB.db');
        setDb(database);
        fetchInventory(database);
        fetchItems(database);
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

  const fetchItems = async (database) => {
    try {
      const result = await database.getAllAsync(
        'SELECT * FROM items WHERE inventory_id = ?',
        [inventoryId]
      );
      setItems(result || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to load items.");
    }
  };

  const handleEditInventory = () => {
    navigation.navigate("editInventory", { inventory });
  };

  const handleDeleteInventory = async () => {
    Alert.alert(
      "Delete Inventory",
      "Are you sure you want to delete this inventory and all its items?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              await db.runAsync('DELETE FROM items WHERE inventory_id = ?', [inventoryId]);
              await db.runAsync('DELETE FROM Inventory WHERE id = ?', [inventoryId]);
              Alert.alert("Success", "Inventory deleted successfully!");
              navigation.navigate("start_1");
            } catch (error) {
              console.error("Error deleting inventory:", error);
              Alert.alert("Error", "Failed to delete inventory.");
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Inventory Name and Description at the Top */}
      <View style={styles.header}>
        <Text style={styles.title}>{inventory ? inventory.name : "Inventory Viewer"}</Text>
        <Text style={styles.description}>
          {inventory?.description || "No description available"}
        </Text>
      </View>

      {/* Add Items Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate("itemManager", { inventoryId })}
      >
        <Text style={styles.addButtonText}>Manage Items</Text>
      </TouchableOpacity>

      {/* Display Items in the Inventory */}
      <ScrollView style={styles.itemsContainer}>
        {items.length === 0 ? (
          <Text style={styles.noItemsText}>No items found in this inventory.</Text>
        ) : (
          items.map((item, index) => (
            <View 
              key={item.id} 
              style={[
                styles.itemRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <Text style={styles.itemCell}>{item.name}</Text>
              <Text style={styles.itemCell}>{item.quantity}</Text>
              <Text style={styles.itemCell}>${item.price}</Text>
              <Text style={styles.itemCell}>{item.category}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Buttons for Editing and Deleting Inventory */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={handleEditInventory}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Edit Inventory</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#FF4444' }]}
          onPress={handleDeleteInventory}
        >
          <MaterialCommunityIcons name="trash" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Delete Inventory</Text>
        </TouchableOpacity>
      </View>
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
  addButton: {
    backgroundColor: '#6C48C5',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 150, // Adjust this value to position the button
  },
  addButtonText: {
    color: '#FFF7F7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemsContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  evenRow: {
    backgroundColor: '#F9F9F9',
  },
  oddRow: {
    backgroundColor: '#FFFFFF',
  },
  itemCell: {
    flex: 1,
    fontSize: 16,
  },
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 16,
    margin: 8,
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
});

export default InventoryViewerScreen;