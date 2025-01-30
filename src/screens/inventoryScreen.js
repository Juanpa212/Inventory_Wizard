import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const CreateInventoryScreen = ({ navigation }) => {
  const [inventoryName, setInventoryName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [db, setDb] = useState(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('MainDB.db');
      setDb(database);
      await createTables(database);
    } catch (error) {
      console.error("Error opening database:", error);
      Alert.alert(
        "Database Error",
        "There was an error initializing the app. Please restart the app."
      );
    }
  };

  const createTables = async (database) => {
    try {
      // Create Inventory table
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS Inventory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          location TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          user_id INTEGER,
          FOREIGN KEY(user_id) REFERENCES Users(id)
        )
      `);
      console.log("Inventory table created successfully");
    } catch (error) {
      console.error("Error creating table:", error);
      Alert.alert(
        "Database Error",
        "There was an error initializing the app. Please restart the app."
      );
    }
  };

  const validateInputs = () => {
    if (!inventoryName.trim()) {
      Alert.alert("Error", "Inventory name is required");
      return false;
    }
    return true;
  };

  const handleCreateInventory = async () => {
    if (isLoading || !db) return;
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const query = `
        INSERT INTO Inventory (name, description, location)
        VALUES (?, ?, ?)
      `;
      
      await db.execAsync(query, [
        inventoryName.trim(),
        description.trim(),
        location.trim()
      ]);

      Alert.alert(
        "Success",
        "Inventory created successfully!",
        [
          {
            text: "Add Items",
            onPress: () => navigation.navigate("AddItems", { 
              inventoryName: inventoryName.trim() 
            })
          },
          {
            text: "View Inventories",
            onPress: () => navigation.navigate("ViewInventories")
          }
        ]
      );

      // Clear form
      setInventoryName("");
      setDescription("");
      setLocation("");

    } catch (error) {
      console.error("Error creating inventory:", error);
      Alert.alert(
        "Error",
        "There was an error creating the inventory. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter inventory location"
          value={location}
          onChangeText={setLocation}
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={[
            styles.createButton,
            isLoading && styles.createButtonDisabled
          ]} 
          onPress={handleCreateInventory}
          disabled={isLoading}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? 'Creating...' : 'Create Inventory'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => navigation.navigate("ViewInventories")}
          disabled={isLoading}
        >
          <Text style={styles.viewButtonText}>View All Inventories</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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