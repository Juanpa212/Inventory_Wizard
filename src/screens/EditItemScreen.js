import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { initDatabase, updateItem } from './databaseHelper';

const EditItemScreen = ({ route, navigation }) => {
  const { item } = route.params;

  const [itemName, setItemName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [price, setPrice] = useState(item.price.toString());
  const [category, setCategory] = useState(item.category || "");
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

    setupDatabase();
  }, []);

  const handleUpdateItem = async () => {
    if (isLoading || !db) return;

    if (!itemName.trim() || !quantity.trim() || !price.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const updatedItem = {
        id: item.id,
        name: itemName.trim(),
        quantity: parseInt(quantity),
        price: parseFloat(price),
        category: category.trim(),
      };

      await updateItem(db, updatedItem);
      Alert.alert("Success", "Item updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Edit Item</Text>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Item Name<Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter item name"
                value={itemName}
                onChangeText={setItemName}
                editable={!isLoading}
                maxLength={50}
              />

              <Text style={styles.label}>Quantity<Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                editable={!isLoading}
                maxLength={5}
              />

              <Text style={styles.label}>Price<Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                editable={!isLoading}
                maxLength={10}
              />

              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter category"
                value={category}
                onChangeText={setCategory}
                editable={!isLoading}
                maxLength={20}
              />

              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!itemName || !quantity || !price || isLoading) && styles.submitButtonDisabled
                ]} 
                onPress={handleUpdateItem}
                disabled={!itemName || !quantity || !price || isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Updating...' : 'Update Item'}
                </Text>
              </TouchableOpacity>
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
});

export default EditItemScreen;