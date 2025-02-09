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
import { initDatabase, updateInventory } from './databaseHelper';

const EditInventoryScreen = ({ route, navigation }) => {
  const { inventory } = route.params;

  const [inventoryName, setInventoryName] = useState(inventory.name);
  const [description, setDescription] = useState(inventory.description || "");
  const [location, setLocation] = useState(inventory.location || "");
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

  const handleUpdateInventory = async () => {
    if (isLoading || !db) return;

    if (!inventoryName.trim()) {
      Alert.alert("Error", "Inventory name is required");
      return;
    }

    setIsLoading(true);

    try {
      const updatedInventory = {
        id: inventory.id,
        name: inventoryName.trim(),
        description: description.trim(),
        location: location.trim(),
      };

      await updateInventory(db, updatedInventory);
      Alert.alert("Success", "Inventory updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update inventory");
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
            <Text style={styles.headerText}>Edit Inventory</Text>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Inventory Name<Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter inventory name"
                value={inventoryName}
                onChangeText={setInventoryName}
                editable={!isLoading}
                maxLength={50}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter inventory description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                editable={!isLoading}
                maxLength={200}
              />

              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter inventory location"
                value={location}
                onChangeText={setLocation}
                editable={!isLoading}
                maxLength={100}
              />

              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!inventoryName || isLoading) && styles.submitButtonDisabled
                ]} 
                onPress={handleUpdateInventory}
                disabled={!inventoryName || isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Updating...' : 'Update Inventory'}
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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

export default EditInventoryScreen;