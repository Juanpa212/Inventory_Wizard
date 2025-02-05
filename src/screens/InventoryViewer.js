import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const InventoryViewer = ({ navigation }) => {
    const [db, setDb] = useState(null);
    const [items, setItems] = useState([]);
    const [inventories, setInventories] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showInventorySelector, setShowInventorySelector] = useState(true);

  useEffect(() => {
    initDatabase();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (db) {
        fetchInventories(db);
      }
    });
  
    return unsubscribe;
  }, [db, navigation]);

  useEffect(() => {
    console.log("Current inventories state:", inventories);
  }, [inventories]);

  const initDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('MainDB.db');
      setDb(database);
  
      // Create tables
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS Inventory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          location TEXT
        );
        
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          inventory_id INTEGER,
          name TEXT NOT NULL,
          quantity INTEGER,
          price DECIMAL(10,2),
          category TEXT,
          FOREIGN KEY(inventory_id) REFERENCES Inventory(id)
        );
      `);
  
  
      await fetchInventories(database);
      setIsLoading(false);
    } catch (error) {
      console.error("Database error:", error);
      setIsLoading(false);
    }
  };
  

  const fetchInventories = async (database) => {
    try {
      // Test select
      const result = await database.execAsync('SELECT * FROM Inventory');
      console.log("Viewer - Data:", result);
      
      if (result?.[0]?.rows) {
        setInventories(result[0].rows);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };


  const fetchItems = async (inventoryId) => {
    try {
      const query = `
        SELECT * FROM items 
        WHERE inventory_id = ? AND name LIKE '%${searchQuery}%'
        ORDER BY ${sortBy} ${sortOrder}
      `;
      const result = await db.execAsync(query, [inventoryId]);
      setItems(result || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to load inventory items.");
    }
  };


  const selectInventory = async (inventory) => {
    setSelectedInventory(inventory);
    setShowInventorySelector(false);
    await fetchItems(inventory.id);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    fetchItems(selectedInventory.id);
  };



  // HARD CODED BACKUP

  // const fetchInventories = async (database) => {
  //   try {
  //     const inventories = [
  //       { id: 1, name: "Compu Solutions", description: "A local IT shop", location: "Market Plaza" },
  //       { id: 2, name: "Fresh Sweets", description: "A family bakery", location: "Carolina" },
  //       { id: 3, name: "Stark labs", description: "A Genius. Billionaire. Philanthropist. Laboratory", location: "his house" }
  //     ];
  //     setInventories(inventories);
      
  //     // Log the state after setting
  //     console.log("Set inventories to:", inventories);
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //   }
  // };

  // const fetchItems = async (inventoryId) => {
  //   try {
  //     // Hardcoded items based on inventory ID
  //     let inventoryItems = [];
  
  //     if (inventoryId === 1) {
  //       inventoryItems = [
  //         { id: 1, name: 'Desktop PC', quantity: 15, price: 899.99, category: 'Computers' },
  //         { id: 2, name: 'Gaming Laptop', quantity: 8, price: 1299.99, category: 'Computers' },
  //         { id: 3, name: 'Mechanical Keyboard', quantity: 25, price: 89.99, category: 'Peripherals' },
  //         { id: 4, name: 'Wireless Mouse', quantity: 40, price: 29.99, category: 'Peripherals' },
  //         { id: 5, name: 'Monitor 27"', quantity: 12, price: 299.99, category: 'Displays' },
  //         { id: 6, name: 'External SSD 1TB', quantity: 30, price: 129.99, category: 'Storage' }
  //       ];
  //     } else if (inventoryId === 2) {
  //       inventoryItems = [
  //         { id: 7, name: 'Chocolate Cake', quantity: 8, price: 32.99, category: 'Cakes' },
  //         { id: 8, name: 'Vanilla Cupcakes', quantity: 48, price: 3.99, category: 'Cupcakes' },
  //         { id: 9, name: 'Apple Pie', quantity: 6, price: 24.99, category: 'Pies' },
  //         { id: 10, name: 'Cookie Box', quantity: 20, price: 15.99, category: 'Cookies' },
  //         { id: 11, name: 'Cheesecake', quantity: 5, price: 28.99, category: 'Cakes' },
  //         { id: 12, name: 'Birthday Cake', quantity: 3, price: 45.99, category: 'Custom Orders' }
  //       ];
  //     } else if (inventoryId === 3) {
  //       inventoryItems = [
  //         { id: 13, name: 'Arc Reactor', quantity: 1, price: 999999.99, category: 'Power Sources' },
  //         { id: 14, name: 'Iron Man Suit Mk3', quantity: 1, price: 1999999.99, category: 'Defense Systems' },
  //         { id: 15, name: 'Repulsor Gloves', quantity: 5, price: 49999.99, category: 'Weapons' },
  //         { id: 16, name: 'AI Assistant Core', quantity: 3, price: 299999.99, category: 'Software' },
  //         { id: 17, name: 'Nanotech Container', quantity: 2, price: 499999.99, category: 'Materials' },
  //         { id: 18, name: 'Quantum Tunnel', quantity: 1, price: 2999999.99, category: 'Research Equipment' }
  //       ];
  //     }
  
  //     if (searchQuery) {
  //       inventoryItems = inventoryItems.filter(item => 
  //         item.name.toLowerCase().includes(searchQuery.toLowerCase())
  //       );
  //     }
  
  //     setItems(inventoryItems);
  //   } catch (error) {
  //     console.error("Error fetching items:", error);
  //     Alert.alert("Error", "Failed to load inventory items.");
  //   }
  // };


  

  // Render inventory selection screen
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
          inventories.map((inventory, index) => (
            <TouchableOpacity
              key={index}
              style={styles.inventoryItem}
              onPress={() => selectInventory(inventory)}
            >
              <View>
                <Text style={styles.inventoryName}>{inventory.name || 'Unnamed Inventory'}</Text>
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

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return (
      <FontAwesome 
        name={sortOrder === 'asc' ? 'sort-up' : 'sort-down'} 
        size={14} 
        color="#6C48C5" 
      />
    );
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <TouchableOpacity 
        style={styles.headerCell} 
        onPress={() => handleSort('name')}
      >
        <Text style={styles.headerText}>Name</Text>
        {renderSortIcon('name')}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.headerCell} 
        onPress={() => handleSort('quantity')}
      >
        <Text style={styles.headerText}>Qty</Text>
        {renderSortIcon('quantity')}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.headerCell} 
        onPress={() => handleSort('price')}
      >
        <Text style={styles.headerText}>Price</Text>
        {renderSortIcon('price')}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.headerCell} 
        onPress={() => handleSort('category')}
      >
        <Text style={styles.headerText}>Category</Text>
        {renderSortIcon('category')}
      </TouchableOpacity>
      
      <View style={styles.headerCell}>
        <Text style={styles.headerText}>Actions</Text>
      </View>
    </View>
  );

  const handleEdit = (item) => {
    navigation.navigate('EditItem', { itemId: item.id });
  };

  const handleDelete = async (itemId) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              await db.execAsync(
                'DELETE FROM items WHERE id = ?',
                [itemId]
              );
              fetchItems(db);
              Alert.alert("Success", "Item deleted successfully!");
            } catch (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Error", "Failed to delete item.");
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Add the missing renderInventoryContents function
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

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            fetchItems(selectedInventory.id);
          }}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddItem', { inventory_id: selectedInventory.id })}
        >
          <FontAwesome name="plus" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.centerContent}>
          <Text>No items found in inventory.</Text>
        </View>
      ) : (
        <ScrollView horizontal>
          <ScrollView style={styles.tableContainer}>
            {renderTableHeader()}
            
            {items.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow
                ]}
              >
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.quantity}</Text>
                <Text style={styles.cell}>${item.price}</Text>
                <Text style={styles.cell}>{item.category}</Text>
                <View style={styles.actionsCell}>
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
        </ScrollView>
      )}
    </View>
  );

  // Single return statement at the end
  if (isLoading) {
    return (
      <View style={styles.centerContent}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return showInventorySelector ? renderInventorySelector() : renderInventoryContents();
};

// Update styles to include new elements
const styles = StyleSheet.create({
  // ... your existing styles ...
  backButton: {
    padding: 10,
    marginRight: 10,
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
  createButton: {
    backgroundColor: '#6C48C5',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#6C48C5',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#6C48C5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  headerCell: {
    flexDirection: 'row',
    padding: 12,
    width: 120,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#F9F9F9',
  },
  cell: {
    padding: 12,
    width: 120,
  },
  actionsCell: {
    flexDirection: 'row',
    padding: 12,
    width: 120,
  },
  actionButton: {
    marginHorizontal: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InventoryViewer;