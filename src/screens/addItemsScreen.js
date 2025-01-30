import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesome } from "@expo/vector-icons";
import * as SQLite from 'expo-sqlite';

const AddItemScreen = ({ route, navigation }) => {
  // Form state
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [db, setDb] = useState(null);

  // Get inventory_id from navigation if passed
  const inventory_id = route.params?.inventory_id;

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('MainDB.db');
      setDb(database);
      await createItemsTable(database);
    } catch (error) {
      console.error("Error opening database:", error);
      Alert.alert("Error", "Unable to access database. Please try again later.");
    }
  };

  const createItemsTable = async (database) => {
    try {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          inventory_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          quantity INTEGER NOT NULL CHECK (quantity >= 0),
          category TEXT,
          brand TEXT,
          price REAL CHECK (price >= 0),
          priority TEXT CHECK (priority IN ('Low', 'Medium', 'High')),
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
          minimum_stock INTEGER DEFAULT 0,
          unit TEXT DEFAULT 'pieces',
          FOREIGN KEY (inventory_id) REFERENCES inventory (id)
        )
      `);
    } catch (error) {
      console.error("Error creating items table:", error);
      Alert.alert("Error", "Failed to initialize database. Please restart the app.");
    }
  };

  const categoryData = [
    { label: "Stickers", value: "Stickers" },
    { label: "Books", value: "Books" },
    { label: "Clothing", value: "Clothing" },
  ];

  const priorityData = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const brandData = [
    { label: "Very_OK", value: "Very_OK" },
    { label: "Lil_Sad", value: "Lil_Sad" },
    { label: "CyberGoth", value: "CyberGoth" },
  ];

  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Item name is required");
      return false;
    }
    if (!quantity.trim() || isNaN(quantity) || parseInt(quantity) < 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return false;
    }
    if (!price.trim() || isNaN(price) || parseFloat(price) < 0) {
      Alert.alert("Error", "Please enter a valid price");
      return false;
    }
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return false;
    }
    if (!priority) {
      Alert.alert("Error", "Please select a priority level");
      return false;
    }
    if (!brand) {
      Alert.alert("Error", "Please select a brand");
      return false;
    }
    return true;
  };

  const handleAddItem = async () => {
    if (isLoading || !db) return;
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const query = `
        INSERT INTO items (
          inventory_id, name, quantity, category, 
          brand, price, priority, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await db.execAsync(query, [
        inventory_id,
        name.trim(),
        parseInt(quantity),
        category,
        brand,
        parseFloat(price),
        priority,
        description.trim()
      ]);

      Alert.alert(
        "Success",
        "Item added successfully!",
        [
          {
            text: "Add Another",
            onPress: () => {
              setName("");
              setQuantity("");
              setPrice("");
              setCategory("");
              setPriority("");
              setBrand("");
              setDescription("");
            }
          },
          {
            text: "View Inventory",
            onPress: () => navigation.navigate("ViewInventory")
          }
        ]
      );
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Failed to add item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add New Item</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <FontAwesome name="plus-circle" size={50} color="#6C48C5" />
          </View>

          <Text style={styles.label}>
            Name<Text style={styles.required}>*</Text>
          </Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter item name" 
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>
            Quantity<Text style={styles.required}>*</Text>
          </Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter quantity" 
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>
            Price<Text style={styles.required}>*</Text>
          </Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter price" 
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <Text style={styles.label}>
            Category<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            style={styles.dropdown}
            data={categoryData}
            labelField="label"
            valueField="value"
            placeholder="Select category"
            value={category}
            onChange={(item) => setCategory(item.value)}
          />

          <Text style={styles.label}>
            Priority<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            style={styles.dropdown}
            data={priorityData}
            labelField="label"
            valueField="value"
            placeholder="Select priority"
            value={priority}
            onChange={(item) => setPriority(item.value)}
          />

          <Text style={styles.label}>
            Brand<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            style={styles.dropdown}
            data={brandData}
            labelField="label"
            valueField="value"
            placeholder="Select brand"
            value={brand}
            onChange={(item) => setBrand(item.value)}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter item description..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity 
            style={[
              styles.button,
              isLoading && styles.buttonDisabled
            ]} 
            onPress={handleAddItem}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Adding Item...' : 'Add Item'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.requiredText}>*Required fields</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#6C48C5',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    color: '#333',
  },
  required: {
    color: "#FF4444",
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dropdown: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6C48C5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#9B89D9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requiredText: {
    fontSize: 14,
    color: "#FF4444",
    marginTop: 10,
    textAlign: "center",
  },
});

export default AddItemScreen;