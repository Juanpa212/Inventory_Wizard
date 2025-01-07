import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import user icon
import SQLite from "react-native-sqlite-storage";

const db = SQLite.openDatabase(
  {
    name: 'MainDB',
    location: 'default',
  },
  () => { console.log("Database opened successfully"); },
  error => { console.log("Error opening database:", error); }
);

const CreateAccountScreen = ({ navigation }) => {
  const [userName, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    createTable();
    getData();
  }, []); // Runs once on mount

  // Create the Users table
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT NOT NULL, Password TEXT NOT NULL, Email TEXT UNIQUE NOT NULL);"
      );
    });
  };

  // Fetch data
  const getData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Users",
          [],
          (tx, results) => {
            if (results.rows.length > 0) {
              navigation.navigate("StartScreen"); // Navigate if data exists
            }
          }
        );
      });
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // Insert data into the table
  const setData = async () => {
    if (userName.length === 0 || password.length === 0 || email.length === 0) {
      Alert.alert("Warning!", "Please fill in all fields.");
    } else {
      try {
        await db.transaction(async (tx) => {
          await tx.executeSql(
            "INSERT INTO Users (Username, Password, Email) VALUES (?, ?, ?);",
            [userName, password, email]
          );
        });
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("StartScreen");
      } catch (error) {
        if (error.message.includes("UNIQUE constraint failed")) {
          Alert.alert("Error", "Email already exists!");
        } else {
          console.log("Error inserting data:", error);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <View style={styles.iconContainer}>
        <FontAwesome name="user-circle" size={80} color="#000" />
      </View>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        onChangeText={(value) => setUser(value)}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        onChangeText={(value) => setEmail(value)}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={(value) => setPassword(value)}
      />

      <TouchableOpacity style={styles.loginButton} onPress={setData}>
        <Text style={styles.loginButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#000',
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#6C48C5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateAccountScreen;
