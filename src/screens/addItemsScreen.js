import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";
import { initDatabase, addItem, createDefaultInventory, checkInventoryExists } from './databaseHelper';

const AddItemScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('low'); // Default priority
  const [inventoryId, setInventoryId] = useState(null); // Dynamic inventory ID

  // Initialize database and fetch/create inventory
  useEffect(() => {
    const initialize = async () => {
      try {
        const db = await initDatabase();

        // Check if an inventory exists
        const inventoryExists = await checkInventoryExists(db, 1); // Check for inventory with ID 1
        if (!inventoryExists) {
          // Create a default inventory if none exists
          const defaultInventoryId = await createDefaultInventory(db);
          setInventoryId(defaultInventoryId);
        } else {
          setInventoryId(1); // Use the existing inventory ID
        }
      } catch (error) {
        console.error("Error initializing database:", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };

    initialize();
  }, []);

  const handleAddItem = async () => {
    // Input validation
    if (!name.trim()) {
      Alert.alert("Error", "Item name is required");
      return;
    }

    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      Alert.alert("Error", "Quantity must be a valid number greater than 0");
      return;
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert("Error", "Price must be a valid number greater than 0");
      return;
    }

    if (!inventoryId) {
      Alert.alert("Error", "Inventory not found. Please try again.");
      return;
    }

    try {
      const db = await initDatabase();
      await addItem(db, {
        inventory_id: inventoryId, // Use dynamic inventory ID
        name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        category,
        priority,
      });

      Alert.alert("Success", "Item added successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Failed to add item");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      <View style={styles.priorityContainer}>
        <Text style={styles.priorityLabel}>Priority:</Text>
        <Picker
          selectedValue={priority}
          style={styles.priorityPicker}
          onValueChange={(itemValue) => setPriority(itemValue)}
        >
          <Picker.Item label="Low" value="low" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="High" value="high" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addButtonText}>Add Item</Text>
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
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  priorityPicker: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  addButton: {
    backgroundColor: '#6C48C5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddItemScreen;