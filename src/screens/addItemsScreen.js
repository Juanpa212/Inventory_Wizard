import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { initDatabase, addItem, verifyDatabaseState } from './databaseHelper';

const addItemScreen = ({ route, navigation }) => {
  const inventoryId = route.params?.inventoryId;
  console.log('Received inventoryId:', inventoryId);
  
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [db, setDb] = useState(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await initDatabase();
        setDb(database);
        
        // Verify database state
        const dbState = await verifyDatabaseState(database);
        console.log('Initial database state:', dbState);
        
        // Enable foreign keys
        await database.execAsync('PRAGMA foreign_keys = ON;');
        
      } catch (error) {
        console.error("Database setup error:", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };
    
    setupDatabase();
  }, []);

  const handleAddItem = async () => {
    console.log('handleAddItem called with values:', {
      inventoryId,
      itemName,
      quantity,
      price,
      category
    });

    if (!db) {
      Alert.alert("Error", "Database not initialized");
      return;
    }

    if (!inventoryId) {
      Alert.alert("Error", "No inventory selected");
      return;
    }

    // Validate required fields
    if (!itemName.trim() || !quantity.trim() || !price.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      // Verify database state before adding
      const beforeState = await verifyDatabaseState(db);
      console.log('Database state before adding item:', beforeState);

      const newItem = {
        inventory_id: parseInt(inventoryId),  // Ensure it's a number
        name: itemName.trim(),
        quantity: parseInt(quantity),
        price: parseFloat(price),
        category: category.trim()
      };

      const addedItem = await addItem(db, newItem);
      console.log('Item added successfully:', addedItem);

      // Verify database state after adding
      const afterState = await verifyDatabaseState(db);
      console.log('Database state after adding item:', afterState);

      Alert.alert(
        "Success",
        "Item added successfully!",
        [
          {
            text: "View Inventory",
            onPress: () => {
              navigation.navigate("invViewer", {
                inventoryId: parseInt(inventoryId)
              });
            }
          },
          {
            text: "Add Another",
            onPress: () => {
              setItemName("");
              setQuantity("");
              setPrice("");
              setCategory("");
            }
          }
        ]
      );
    } catch (error) {
      console.error("Insert error:", error);
      Alert.alert("Error", `Failed to add item: ${error.message}`);
    }
  };
  const showInputAlert = (fieldName, requirements) => {
    Alert.alert(
      `Invalid ${fieldName}`,
      `${fieldName} ${requirements}`,
      [{ text: "OK", style: "default" }]
    );
  };

  const handleInputValidation = {
    name: (text) => {
      const letterOnly = /^[A-Za-z\s]*$/;
      if (!letterOnly.test(text) && text !== "") {
        showInputAlert("Item Name", "must contain only letters and spaces");
        return itemName;
      }
      return text;
    },
    
    quantity: (text) => {
      const integerOnly = /^\d*$/;
      if (!integerOnly.test(text) && text !== "") {
        showInputAlert("Quantity", "must be a whole number");
        return quantity;
      }
      return text;
    },
    
    price: (text) => {
      const doubleOnly = /^\d*\.?\d*$/;
      if (!doubleOnly.test(text) && text !== "") {
        showInputAlert("Price", "must be a valid number (e.g., 12.99)");
        return price;
      }
      return text;
    },
    
    category: (text) => {
      const letterOnly = /^[A-Za-z\s]*$/;
      if (!letterOnly.test(text) && text !== "") {
        showInputAlert("Category", "must contain only letters and spaces");
        return category;
      }
      return text;
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
 
          <Text style={styles.label}>Item Name<Text style={styles.required}>*</Text></Text>
          <Text style={styles.helperText}>Letters and spaces only</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item name"
            value={itemName}
            onChangeText={(text) => setItemName(handleInputValidation.name(text))}
          />
 
          <Text style={styles.label}>Quantity<Text style={styles.required}>*</Text></Text>
          <Text style={styles.helperText}>Whole numbers only</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a quantity"
            value={quantity}
            onChangeText={(text) => setQuantity(handleInputValidation.quantity(text))}
            keyboardType="numeric"
          />
 
          <Text style={styles.label}>Price<Text style={styles.required}>*</Text></Text>
          <Text style={styles.helperText}>Numbers and one decimal point only (e.g., 12.99)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            value={price}
            onChangeText={(text) => setPrice(handleInputValidation.price(text))}
            keyboardType="decimal-pad"
          />
 
          <Text style={styles.label}>Category</Text>
          <Text style={styles.helperText}>Letters and spaces only</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter category"
            value={category}
            onChangeText={(text) => setCategory(handleInputValidation.category(text))}
          />
 
          <TouchableOpacity 
            style={[styles.button, (!itemName || !quantity || !price) && styles.buttonDisabled]} 
            onPress={handleAddItem}
            disabled={!itemName || !quantity || !price}
          >
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
 
          <Text style={styles.requiredText}>* Required fields</Text>
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
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    marginBottom: 4,
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