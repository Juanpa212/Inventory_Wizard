import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import Checkbox from 'expo-checkbox';

const DeleteItemsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { inventoryId } = route.params;

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Track selected items
  const [db, setDb] = useState(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('MainDB.db');
        setDb(database);
        fetchItems(database);
      } catch (error) {
        console.error("Database setup error:", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };

    setupDatabase();
  }, []);

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

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      // If the item is already selected, remove it
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      // If the item is not selected, add it
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleDeleteSelectedItems = async () => {
    if (selectedItems.length === 0) {
      Alert.alert("Error", "No items selected.");
      return;
    }

    Alert.alert(
      "Delete Items",
      "Are you sure you want to delete the selected items?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              // Delete selected items from the database
              await db.runAsync(
                `DELETE FROM items WHERE id IN (${selectedItems.join(',')})`
              );
              Alert.alert("Success", "Selected items deleted successfully!");
              fetchItems(db); // Refresh the list
              setSelectedItems([]); // Clear selected items
            } catch (error) {
              console.error("Error deleting items:", error);
              Alert.alert("Error", "Failed to delete items.");
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Delete Items</Text>

      {/* List of Items with Checkboxes */}
      <ScrollView style={styles.itemsContainer}>
        {items.length === 0 ? (
          <Text style={styles.noItemsText}>No items found in this inventory.</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Checkbox
                value={selectedItems.includes(item.id)}
                onValueChange={() => handleSelectItem(item.id)}
                color={selectedItems.includes(item.id) ? '#6C48C5' : undefined}
              />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>Qty: {item.quantity}</Text>
              <Text style={styles.itemDetails}>Price: ${item.price}</Text>
              <Text style={styles.itemDetails}>Category: {item.category}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Delete Selected Button */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDeleteSelectedItems}
      >
        <Text style={styles.deleteButtonText}>Delete Selected</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F7',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C48C5',
    textAlign: 'center',
    marginBottom: 16,
  },
  itemsContainer: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  deleteButtonText: {
    color: '#FFF7F7',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeleteItemsScreen;