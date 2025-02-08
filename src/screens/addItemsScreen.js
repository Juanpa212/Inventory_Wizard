import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { initDatabase, addItem } from './databaseHelper';

const addItemScreen = ({ route, navigation }) => {
  const inventoryId = route.params?.inventoryId;
  
  // Add all required state variables
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(false);  // Added isLoading state

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await initDatabase();
        setDb(database);
      } catch (error) {
        console.error("Database setup error:", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };

    // useEffect(() => {
    //   const inventoryId = route.params?.inventoryId;
    //   console.log('AddItemScreen mounted with params:', route.params);
    //   console.log('Inventory ID type:', typeof inventoryId);
    //   console.log('Inventory ID value:', inventoryId);
    // }, [route.params]);
    
    setupDatabase();
  }, []);

  const validateName = (name) => {
    const trimmed = name.trim();
    const nameRegex = /^[a-zA-Z0-9\s-]+$/;
    if (!trimmed) return "Name is required";
    if (!nameRegex.test(trimmed)) return "Name can only contain letters, numbers, spaces, and hyphens";
    if (trimmed.length < 2) return "Name must be at least 2 characters long";
    if (trimmed.length > 50) return "Name must be less than 50 characters";
    return null;
  };
  
  const validateQuantity = (quantity) => {
    const num = parseInt(quantity);
    if (!quantity) return "Quantity is required";
    if (isNaN(num)) return "Quantity must be a number";
    if (num < 0) return "Quantity cannot be negative";
    if (num > 99999) return "Quantity must be less than 100,000";
    return null;
  };
  
  const validatePrice = (price) => {
    const num = parseFloat(price);
    if (!price) return "Price is required";
    if (isNaN(num)) return "Price must be a number";
    if (num < 0) return "Price cannot be negative";
    if (num > 999999.99) return "Price must be less than 1,000,000";
    if (!/^\d+(\.\d{0,2})?$/.test(price)) return "Price can only have up to 2 decimal places";
    return null;
  };
  
  const validateCategory = (category) => {
    if (!category) return null; // Category is optional
    const trimmed = category.trim();
    const categoryRegex = /^[a-zA-Z\s-]+$/;
    if (!categoryRegex.test(trimmed)) return "Category can only contain letters, spaces, and hyphens";
    if (trimmed.length > 30) return "Category must be less than 30 characters";
    return null;
  };
  
  const handleAddItem = async () => {
    console.log('Handle add item called with:', {
      inventoryId: route.params?.inventoryId,
      itemName,
      quantity,
      price,
      category
    });
  
    if (isLoading || !db) {
      console.log('Early return due to:', { isLoading, hasDb: !!db });
      return;
    }
  
    const inventoryId = route.params?.inventoryId;
    if (!inventoryId) {
      Alert.alert("Error", "No inventory selected");
      return;
    }
  
    if (!itemName.trim() || !quantity.trim() || !price.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log('Creating new item for inventory:', inventoryId);
  
      const newItem = {
        inventory_id: parseInt(inventoryId),
        name: itemName.trim(),
        quantity: parseInt(quantity),
        price: parseFloat(price),
        category: category.trim()
      };
  
      console.log('Attempting to add item:', newItem);
  
      const result = await addItem(db, newItem);
      console.log('Successfully added item:', result);
  
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
    } finally {
      setIsLoading(false);
    }
  };
  // Add these input handlers
  const handleQuantityChange = (text) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, '');
    setQuantity(cleaned);
  };
  
  const handlePriceChange = (text) => {
    // Allow numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return;
    setPrice(cleaned);
  };
  
  const handleNameChange = (text) => {
    // Limit length to 50 characters
    if (text.length <= 50) {
      setItemName(text);
    }
  };
  
  const handleCategoryChange = (text) => {
    // Only allow letters, spaces, and hyphens
    const cleaned = text.replace(/[^a-zA-Z\s-]/g, '');
    if (cleaned.length <= 30) {
      setCategory(cleaned);
    }
  };
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Add New Item</Text>
          </View>

          <ScrollView style={styles.scrollView} bounces={false}>
            <View style={styles.formContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome name="plus-circle" size={50} color="#6C48C5" />
              </View>

              <Text style={styles.label}>Item Name<Text style={styles.required}>*</Text></Text>
              <Text style={styles.helperText}>Letters and spaces only</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter item name"
                value={itemName}
                onChangeText={handleNameChange}
                editable={!isLoading}
                maxLength={25}
              />

              <Text style={styles.label}>Quantity<Text style={styles.required}>*</Text></Text>
              <Text style={styles.helperText}>Whole numbers only</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter quantity"
                value={quantity}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
                editable={!isLoading}
                maxLength={5}
              />

              <Text style={styles.label}>Price<Text style={styles.required}>*</Text></Text>
              <Text style={styles.helperText}>Numbers and one decimal point only (e.g., 12.99)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={price}
                onChangeText={handlePriceChange}
                keyboardType="decimal-pad"
                editable={!isLoading}
                maxLength={10}
              />
              <Text style={styles.label}>Category</Text>
              <Text style={styles.helperText}>Letters and spaces only</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter category"
                value={category}
                onChangeText={handleCategoryChange}
                editable={!isLoading}
                maxLength={20}
              />

              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!itemName || !quantity || !price || isLoading) && styles.submitButtonDisabled
                ]} 
                onPress={handleAddItem}
                disabled={!itemName || !quantity || !price || isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Adding...' : 'Add Item'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.requiredText}>* Required fields</Text>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
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
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    color: '#333',
  },
  required: {
    color: "#FF4444",
    marginLeft: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    marginBottom: 4,
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
  submitButton: {
    backgroundColor: '#6C48C5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#9B89D9',
  },
  submitButtonText: {
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