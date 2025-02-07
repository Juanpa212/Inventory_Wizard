// InventoryViewer.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { initDatabase, verifyDatabaseState } from './databaseHelper';

const InventoryViewer = ({ navigation, route }) => {
  const [db, setDb] = useState(null);
  const [items, setItems] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInventorySelector, setShowInventorySelector] = useState(true);

  useEffect(() => {
    initDatabase().then(database => {
      setDb(database);
      fetchInventories(database);
    }).catch(error => {
      console.error("Database initialization error:", error);
      Alert.alert("Error", "Failed to initialize database");
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (db) {
        fetchInventories(db);
      }
    });
    return unsubscribe;
  }, [db, navigation]);

  const fetchInventories = async (database) => {
    try {
      const result = await database.getAllAsync('SELECT * FROM Inventory');
      console.log("Fetched inventories:", result);
      setInventories(result || []);
    } catch (error) {
      console.error("Error fetching inventories:", error);
      Alert.alert("Error", "Failed to fetch inventories");
    }
  };

  const fetchItems = async (inventoryId) => {
    try {
      console.log(`Fetching items for inventory ${inventoryId}`);
      
      const query = 'SELECT * FROM items WHERE inventory_id = ?';
      console.log('Executing query:', query, 'with id:', inventoryId);
      
      const result = await db.getAllAsync(query, [inventoryId]);
      console.log('Fetched items:', result);
      
      setItems(result || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to fetch inventory items");
    }
  };

  const selectInventory = async (inventory) => {
    console.log('Selecting inventory:', inventory);
    setSelectedInventory(inventory);
    setShowInventorySelector(false);
    await fetchItems(inventory.id);
  };

  const renderInventorySelector = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Inventory</Text>
      </View>

      <ScrollView style={styles.inventoryList}>
        {inventories.length === 0 ? (
          <View style={styles.centerContent}>
            <Text>No inventories found.</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => navigation.navigate('inventory')}
            >
              <Text style={styles.createButtonText}>Create New Inventory</Text>
            </TouchableOpacity>
          </View>
        ) : (
          inventories.map((inventory) => (
            <TouchableOpacity
              key={inventory.id}
              style={styles.inventoryItem}
              onPress={() => selectInventory(inventory)}
            >
              <View>
                <Text style={styles.inventoryName}>{inventory.name}</Text>
                <Text style={styles.inventoryDescription}>
                  {inventory.description || 'No description'}
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={20} color="#6C48C5" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderInventoryContents = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setShowInventorySelector(true)}
        >
          <FontAwesome name="chevron-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedInventory.name}</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.centerContent}>
          <Text>No items found in inventory.</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              console.log('Navigating to add with inventoryId:', selectedInventory.id);
              navigation.navigate('add', {
                inventoryId: selectedInventory.id
              });
            }}
          >
            <Text style={styles.addButtonText}>Add Items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.itemList}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemInfo}>Quantity: {item.quantity}</Text>
                <Text style={styles.itemInfo}>Price: ${item.price}</Text>
                {item.category && (
                  <Text style={styles.itemInfo}>Category: {item.category}</Text>
                )}
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEdit(item)}
                >
                  <FontAwesome name="edit" size={20} color="#6C48C5" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <FontAwesome name="trash" size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContent}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return showInventorySelector ? renderInventorySelector() : renderInventoryContents();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#6C48C5',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inventoryList: {
    flex: 1,
    padding: 16,
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
    marginBottom: 4,
  },
  inventoryDescription: {
    fontSize: 14,
    color: '#666',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  createButton: {
    backgroundColor: '#6C48C5',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#6C48C5',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  itemList: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
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
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default InventoryViewer;