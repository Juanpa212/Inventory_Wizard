import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { initDatabase, getItems } from './databaseHelper';

const StockAlertsPage = ({ navigation }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
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
      const items = await getItems(database);
      setInventoryItems(items || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to load items");
    }
  };

  const isLowStock = (item) => {
    switch (item.priority) {
      case 'high':
        return item.quantity > 0 && item.quantity < 20;
      case 'medium':
        return item.quantity > 0 && item.quantity < 12;
      case 'low':
        return item.quantity > 0 && item.quantity < 7;
      default:
        return false;
    }
  };

  const outOfStockItems = inventoryItems.filter(item => item.quantity === 0);
  const lowStockItems = inventoryItems.filter(item => isLowStock(item));

  const StockItem = ({ item, type }) => {
    // Define priority colors
    const priorityColors = {
      'high': '#FF4444',    // Red
      'medium': '#FFA000',  // Yellow/Orange
      'low': '#4CAF50'      // Green
    };

    return (
      <TouchableOpacity 
        style={styles.itemButton}
        onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
      >
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text 
            style={[
              styles.priorityText, 
              { color: priorityColors[item.priority] }
            ]}
          >
            {item.priority}
          </Text>
        </View>
        <View style={styles.stockInfo}>
          <Text style={[
            styles.stockText,
            { color: type === 'out' ? '#FF4444' : '#FFA000' }
          ]}>
            {item.quantity}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Alerts</Text>
      
      <ScrollView style={styles.scrollView}>
        {outOfStockItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="error-outline" size={24} color="#FFF7F7" />
              <Text style={styles.sectionTitle}>Out of Stock</Text>
              <Text style={styles.itemCount}>({outOfStockItems.length})</Text>
            </View>
            {outOfStockItems.map(item => (
              <StockItem key={item.id} item={item} type="out" />
            ))}
          </View>
        )}

        {lowStockItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="warning" size={24} color="#FFF7F7" />
              <Text style={styles.sectionTitle}>Low Stock</Text>
              <Text style={styles.itemCount}>({lowStockItems.length})</Text>
            </View>
            {lowStockItems.map(item => (
              <StockItem key={item.id} item={item} type="low" />
            ))}
          </View>
        )}

        {outOfStockItems.length === 0 && lowStockItems.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="check-circle" size={48} color="#FFF7F7" />
            <Text style={styles.emptyStateText}>All items are well stocked!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C48C5',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF7F7',
    marginLeft: 8,
  },
  itemCount: {
    fontSize: 18,
    color: '#FFF7F7',
    marginLeft: 8,
    opacity: 0.8,
  },
  itemButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF7F7',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    color: '#6C48C5',
    fontWeight: '600',
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
    textTransform: 'capitalize',
  },
  stockInfo: {
    marginLeft: 16,
  },
  stockText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#FFF7F7',
    marginTop: 16,
    fontWeight: '600',
  },
});

export default StockAlertsPage;