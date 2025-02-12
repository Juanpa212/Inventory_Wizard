import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import useRoute
import { initDatabase, getItems } from './databaseHelper';

const ViewInventoryScreen = () => {
  const route = useRoute(); // Get the route object
  const { inventoryId } = route.params; // Extract inventoryId from route params
  const [items, setItems] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await initDatabase();
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
      // Fetch items only for the current inventory
      const result = await database.getAllAsync(
        'SELECT * FROM items WHERE inventory_id = ?',
        [inventoryId]
      );
      setItems(result || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to load items");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>

      <ScrollView style={styles.scrollView}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.itemHeader]}>Items</Text>
          <Text style={[styles.headerText, styles.quantityHeader]}>Quantity</Text>
          <Text style={[styles.headerText, styles.priceHeader]}>Price</Text>
          <Text style={[styles.headerText, styles.categoryHeader]}>Category</Text>
          <Text style={[styles.headerText, styles.priorityHeader]}>Priority</Text>
        </View>

        {/* Table Rows */}
        {items.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.cellText, styles.itemCell]}>{item.name}</Text>
            <Text style={[styles.cellText, styles.quantityCell]}>{item.quantity}</Text>
            <Text style={[styles.cellText, styles.priceCell]}>${item.price.toFixed(2)}</Text>
            <Text style={[styles.cellText, styles.categoryCell]}>{item.category || 'N/A'}</Text>
            <Text style={[styles.cellText, styles.priorityCell, { color: getPriorityColor(item.priority) }]}>
              {item.priority || 'N/A'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Helper function to get priority color
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return '#FF4444'; // Red
    case 'medium':
      return '#FFA000'; // Yellow/Orange
    case 'low':
      return '#4CAF50'; // Green
    default:
      return '#666'; // Gray
  }
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
  scrollView: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#6C48C5',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemHeader: {
    flex: 1,
  },
  quantityHeader: {
    flex: 1,
    textAlign: 'center',
  },
  priceHeader: {
    flex: 1,
    textAlign: 'center',
  },
  categoryHeader: {
    flex: 1,
    textAlign: 'center',
  },
  priorityHeader: {
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
  itemCell: {
    flex: 1,
  },
  quantityCell: {
    flex: 1,
    textAlign: 'center',
  },
  priceCell: {
    flex: 1,
    textAlign: 'center',
  },
  categoryCell: {
    flex: 1,
    textAlign: 'center',
  },
  priorityCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ViewInventoryScreen;