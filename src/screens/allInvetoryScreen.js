import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const AllInventoriesScreen = () => {
  const navigation = useNavigation();
  const [inventories, setInventories] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('MainDB.db');
        setDb(database);
        fetchInventories(database);
      } catch (error) {
        console.error("Database setup error:", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };

    setupDatabase();
  }, []);

  const fetchInventories = async (database) => {
    try {
      const result = await database.getAllAsync('SELECT * FROM Inventory');
      setInventories(result || []);
    } catch (error) {
      console.error("Error fetching inventories:", error);
      Alert.alert("Error", "Failed to load inventories.");
    }
  };

  const handleInventoryPress = (inventoryId) => {
    navigation.navigate("inventoryManager", { inventoryId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Inventories</Text>

      {/* List of Inventories */}
      <ScrollView style={styles.inventoriesContainer}>
        {inventories.length === 0 ? (
          <Text style={styles.noInventoriesText}>No inventories found.</Text>
        ) : (
          inventories.map((inventory) => (
            <TouchableOpacity
              key={inventory.id}
              style={styles.inventoryItem}
              onPress={() => handleInventoryPress(inventory.id)}
            >
              <Text style={styles.inventoryName}>{inventory.name}</Text>
              <Text style={styles.inventoryDescription}>
                {inventory.description || "No description"}
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#6C48C5" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  inventoriesContainer: {
    flex: 1,
  },
  inventoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  inventoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  inventoryDescription: {
    fontSize: 14,
    color: '#666',
  },
  noInventoriesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default AllInventoriesScreen;