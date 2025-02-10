import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const InventoryManagerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { inventoryId } = route.params; // Get the inventoryId from navigation params

  const [items, setItems] = useState([]);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>

      {/* Buttons for Managing Inventory */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("manageItems", { inventoryId })}
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

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("invViewer", { inventoryId })}
        >
          <MaterialCommunityIcons name="cog" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>View Inventory</Text>
        </TouchableOpacity>
      </View>

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

      {/* Help Button */}
      <TouchableOpacity 
        style={[styles.helpButton, { backgroundColor: '#6C48C5' }]}
        onPress={() => navigation.navigate("Help")}
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
    paddingTop: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C48C5',
    marginBottom: 24,
    textAlign: 'center',
    position: "absolute",
    top: 32,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  helpButton: {
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
  itemsContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
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
});

export default InventoryManagerScreen;