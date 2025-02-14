import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { initDatabase, getItems } from './databaseHelper';

const ViewInventoryScreen = ({ route }) => {
  const { inventoryId } = route.params; // Get inventoryId from navigation params
  const [items, setItems] = useState([]);

  // Fetch items for the current inventory
  const fetchItems = async () => {
    try {
      const db = await initDatabase();
      const fetchedItems = await getItems(db, inventoryId);
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [inventoryId]); // Fetch items when inventoryId changes

  // Get priority color based on priority level
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#FF4444'; // Red for high priority
      case 'medium':
        return '#FFD700'; // Yellow for medium priority
      case 'low':
        return '#4CAF50'; // Green for low priority
      default:
        return '#333'; // Default color
    }
  };

  // Render table header
  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerText, styles.columnName]}>Name</Text>
      <Text style={[styles.headerText, styles.columnQuantity]}>Quantity</Text>
      <Text style={[styles.headerText, styles.columnPrice]}>Price</Text>
      <Text style={[styles.headerText, styles.columnCategory]}>Category</Text>
      <Text style={[styles.headerText, styles.columnPriority]}>Priority</Text>
    </View>
  );

  // Render table row
  const renderTableRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cellText, styles.columnName]}>{item.name}</Text>
      <Text style={[styles.cellText, styles.columnQuantity]}>{item.quantity}</Text>
      <Text style={[styles.cellText, styles.columnPrice]}>${item.price.toFixed(2)}</Text>
      <Text style={[styles.cellText, styles.columnCategory]}>{item.category}</Text>
      <Text
        style={[
          styles.cellText,
          styles.columnPriority,
          { color: getPriorityColor(item.priority) },
        ]}
      >
        {item.priority}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Items</Text>
      {renderTableHeader()}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTableRow}
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
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#6C48C5',
    borderRadius: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for header
  },
  cellText: {
    color: '#333',
  },
  columnName: {
    flex: 1,
    paddingLeft: 8,
  },
  columnQuantity: {
    flex: 1,
    textAlign: 'center',
  },
  columnPrice: {
    flex: 1,
    textAlign: 'center',
  },
  columnCategory: {
    flex: 1,
    textAlign: 'center',
  },
  columnPriority: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold', // Make priority text bold
  },
});

export default ViewInventoryScreen;