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

import { useNavigation, useRoute } from '@react-navigation/native'; //navigation hooks

const addItemScreen = () => {
// const addItemScreen = ({ navigation }) => {

  // use of hooks inside the component
  const navigation = useNavigation();
  const route = useRoute();

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
  const [inventoryId, setInventoryId] = useState(1);

  // Dropdown data
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

  // getting the inventory
  useEffect(() => {
    if (route.params?.inventory_id) {
      setInventoryId(route.params.inventory_id);
    }
  }, [route.params]);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('MainDB.db');
        setDb(database);

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            inventory_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            category TEXT,
            brand TEXT,
            price REAL,
            priority TEXT,
            description TEXT
          )
        `);

        console.log("Database and table setup complete");
      } catch (error) {
        console.error("Database setup error:", error);
        Alert.alert(
          "Database Error",
          "There was an error setting up the database. Please restart the app."
        );
      }
    };

    setupDatabase();

    // Get inventory ID from navigation if available
    const currentRoute = navigation.getState().routes.find(route => route.name === 'add');
    if (currentRoute?.params?.inventory_id) {
      setInventoryId(currentRoute.params.inventory_id);
    }
  }, []);

  const handleAddItem = async () => {
    if (isLoading || !db) return;

    // Validate inputs
    if (!name.trim() || !quantity.trim() || !price.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const insertQuery = `
        INSERT INTO items (inventory_id, name, quantity, category, brand, price, priority, description)
        VALUES ("${inventoryId}", "${name.trim()}", "${quantity}", "${category}", "${brand}", "${price}", "${priority}", "${description}")
      `;

      console.log("Executing query:", insertQuery);
      await db.execAsync(insertQuery);
      
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
            onPress: () => navigation.navigate("#")  // must change to navigation to view inventory page
          }
        ]
      );
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert(
        "Error",
        "Failed to add item. Please try again."
      );
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
            onChange={item => setCategory(item.value)}
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
            onChange={item => setPriority(item.value)}
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
            onChange={item => setBrand(item.value)}
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

export default addItemScreen;