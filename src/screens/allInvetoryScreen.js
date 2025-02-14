import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { initDatabase, getAllInventories, deleteInventory } from './databaseHelper';

const AllInventoriesScreen = () => {
  const navigation = useNavigation();
  const [inventories, setInventories] = useState([]);

  // Fetch all inventories
  const fetchInventories = async () => {
    try {
      const db = await initDatabase();
      const fetchedInventories = await getAllInventories(db);
      setInventories(fetchedInventories);
    } catch (error) {
      console.error("Error fetching inventories:", error);
      Alert.alert("Error", "Failed to fetch inventories");
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  // Handle inventory deletion
  const handleDeleteInventory = async (inventoryId) => {
    try {
      const db = await initDatabase();
      await deleteInventory(db, inventoryId);
      Alert.alert("Success", "Inventory deleted successfully", [
        {
          text: "OK",
          onPress: () => fetchInventories(), // Refresh the list after deletion
        },
      ]);
    } catch (error) {
      console.error("Error deleting inventory:", error);
      Alert.alert("Error", "Failed to delete inventory");
    }
  };

  // Render each inventory item
  const renderInventoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('inventoryManager', { inventoryId: item.id })}
    >
      <View style={styles.inventoryItem}>
        <Text style={styles.inventoryName}>{item.name}</Text>
        <Text style={styles.inventoryDescription}>{item.description}</Text>
        <Text style={styles.inventoryLocation}>{item.location}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteInventory(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Inventories</Text>
      <FlatList
        data={inventories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderInventoryItem}
      />
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
    marginBottom: 16,
  },
  inventoryItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  inventoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inventoryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  inventoryLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AllInventoriesScreen;