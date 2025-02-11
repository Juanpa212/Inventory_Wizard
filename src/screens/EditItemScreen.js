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
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { initDatabase, updateItem } from './databaseHelper';

const EditItemScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { inventoryId } = route.params;

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemSelector, setShowItemSelector] = useState(true);
  
  // Form state
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await initDatabase();
        setDb(database);
        await fetchItems(database);
      } catch (error) {
        console.error("Database setup error:", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };

    setupDatabase();
  }, []);

  const fetchItems = async (database) => {
    try {
      const result = await database.getAllAsync(
        'SELECT * FROM items WHERE inventory_id = ?',
        [inventoryId]
      );
      setItems(result || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to load items.");
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setItemName(item.name);
    setQuantity(item.quantity.toString());
    setPrice(item.price.toString());
    setCategory(item.category || "");
    setShowItemSelector(false);
  };

  const handleUpdateItem = async () => {
    if (isLoading || !db) return;

    if (!itemName.trim() || !quantity.trim() || !price.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const updatedItem = {
        id: selectedItem.id,
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

  const handleQuantityChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setQuantity(cleaned);
  };

  const handlePriceChange = (text) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setPrice(cleaned);
  };

  // Item Selection Modal
  const ItemSelector = () => (
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Select an Item to Edit</Text>
      <ScrollView style={styles.itemList}>
        {items.length === 0 ? (
          <Text style={styles.noItemsText}>No items found in this inventory.</Text>
        ) : (
          items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemButton}
              onPress={() => handleSelectItem(item)}
            >
              <Text style={styles.itemButtonText}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                Qty: {item.quantity} | Price: ${item.price} | Category: {item.category || 'N/A'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  // Edit Form
  const EditForm = () => (
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
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
                editable={!isLoading}
                maxLength={5}
              />

              <Text style={styles.label}>Price<Text style={styles.required}>*</Text></Text>
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
              <TextInput
                style={styles.input}
                placeholder="Enter category"
                value={category}
                onChangeText={setCategory}
                editable={!isLoading}
                maxLength={20}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={handleUpdateItem}
                  disabled={!itemName || !quantity || !price || isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Updating...' : 'Update Item'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowItemSelector(true)}
                >
                  <Text style={styles.buttonText}>Select Different Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

  return showItemSelector ? <ItemSelector /> : <EditForm />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C48C5',
    textAlign: 'center',
    marginBottom: 16,
  },
  itemList: {
    flex: 1,
  },
  itemButton: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  itemButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
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
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 8,
  },
  updateButton: {
    backgroundColor: '#6C48C5',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditItemScreen;