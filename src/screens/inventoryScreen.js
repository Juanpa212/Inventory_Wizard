import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { initDatabase, createInventory } from './databaseHelper';

const CreateInventoryScreen = ({ navigation }) => {
  const [inventoryName, setInventoryName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [db, setDb] = useState(null);

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

  const handleCreateInventory = async () => {
    if (isLoading || !db) {
      console.log('Early return due to:', { isLoading, hasDb: !!db });
      return;
    }
  
    const trimmedName = inventoryName.trim();
    console.log('Trimmed name:', trimmedName);
    
    if (!trimmedName) {
      Alert.alert("Error", "Inventory name is required");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const newInventory = {
        name: trimmedName,
        description: description.trim(),
        location: location.trim()
      };
  
      console.log('Attempting to create inventory:', newInventory);
  
      const createdInventory = await createInventory(db, newInventory);
      console.log('Successfully created inventory:', createdInventory);
  
      // Verify the inventory was created
      const verifyInventory = await db.getAllAsync('SELECT * FROM Inventory WHERE id = ?', [createdInventory.id]);
      console.log('Verification result:', verifyInventory);
  
      Alert.alert(
        "Success",
        "Inventory created successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("invViewer", {
                inventoryId: createdInventory.id
              });
            }
          }
        ]
      );
  
      setInventoryName("");
      setDescription("");
      setLocation("");
  
    } catch (error) {
      console.error("Error creating inventory:", error);
      Alert.alert(
        "Error", 
        `Failed to create inventory: ${error.message}`
      );
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
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Create New Inventory</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome name="warehouse" size={50} color="#6C48C5" />
            </View>

            <Text style={styles.label}>Inventory Name*</Text>
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
                styles.createButton,
                (isLoading || !inventoryName.trim()) && styles.createButtonDisabled
              ]} 
              onPress={handleCreateInventory}
              disabled={isLoading || !inventoryName.trim()}
            >
              <Text style={styles.createButtonText}>
                {isLoading ? 'Creating...' : 'Create Inventory'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => navigation.navigate("invViewer")}
              disabled={isLoading}
            >
              <Text style={styles.viewButtonText}>View All Inventories</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#6C48C5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonDisabled: {
    backgroundColor: '#9B89D9',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#6C48C5',
  },
  viewButtonText: {
    color: '#6C48C5',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreateInventoryScreen;