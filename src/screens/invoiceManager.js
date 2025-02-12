import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase } from './databaseHelper';

const LOW_STOCK_THRESHOLD = 10;
const COOLDOWN_PERIOD = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const InvoiceManagerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { inventoryId } = route.params || {};

  useFocusEffect(
    React.useCallback(() => {
      const checkStockLevels = async () => {
        try {
          // Check last notification time
          const lastNotificationTime = await AsyncStorage.getItem('lastStockNotificationTime');
          const currentTime = new Date().getTime();

          if (lastNotificationTime) {
            const timeSinceLastNotification = currentTime - parseInt(lastNotificationTime);
            if (timeSinceLastNotification < COOLDOWN_PERIOD) {
              // Skip notification if within cooldown period
              return;
            }
          }

          const database = await initDatabase();
          const result = await database.getAllAsync(
            `SELECT name, quantity FROM items 
             WHERE inventory_id = ? AND quantity <= ?`,
            [inventoryId, LOW_STOCK_THRESHOLD]
          );

          if (result && result.length > 0) {
            // Group low stock items for a single notification
            const lowStockItems = result.map(item => 
              `${item.name} (${item.quantity} remaining)`
            ).join('\n');

            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Low Stock Alert',
                body: `The following items are running low:\n${lowStockItems}`,
                priority: 'high',
                sound: true,
              },
              trigger: null,
            });

            // Update last notification time
            await AsyncStorage.setItem('lastStockNotificationTime', currentTime.toString());
          }
        } catch (error) {
          console.error("Error checking stock levels:", error);
        }
      };

      checkStockLevels();
    }, [inventoryId])
  );

  // Function to manually check stock (optional)
  const manualStockCheck = async () => {
    try {
      const database = await initDatabase();
      const result = await database.getAllAsync(
        `SELECT name, quantity FROM items 
         WHERE inventory_id = ? AND quantity <= ?`,
        [inventoryId, LOW_STOCK_THRESHOLD]
      );

      if (result && result.length > 0) {
        const lowStockItems = result.map(item => 
          `${item.name}: ${item.quantity} remaining`
        );

        // Show as an alert instead of notification for manual checks
        Alert.alert(
          'Current Low Stock Items',
          lowStockItems.join('\n'),
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Stock Status', 'All items are above minimum stock levels.');
      }
    } catch (error) {
      console.error("Error checking stock levels:", error);
      Alert.alert('Error', 'Failed to check stock levels');
    }
  };

  if (!inventoryId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Inventory ID is missing.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoice Manager</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("createInvoice", { inventoryId })}
        >
          <MaterialCommunityIcons name="plus-circle" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Create Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("invoiceDetail", { inventoryId })}
        >
          <MaterialCommunityIcons name="eye" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>View Invoices</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("deleteInvoice", { inventoryId })}
        >
          <MaterialCommunityIcons name="delete" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Delete Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("inventoryManager", { inventoryId })}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Back to Inventory</Text>
        </TouchableOpacity>
      </View>

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
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C48C5',
    textAlign: 'center',
    position: 'absolute',
    top: 50,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  buttonContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 16,
    margin: 8,
    width: '45%',
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
    position: 'absolute',
    bottom: 50,
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
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#6C48C5',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});

export default InvoiceManagerScreen;