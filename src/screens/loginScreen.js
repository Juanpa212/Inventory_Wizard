import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';


// import * as SQLite from 'expo-sqlite/legacy';
// Open the database
const db = SQLite.openDatabase("MainDB.db");
console.log(db);
console.log(db.transaction);
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Ensure the database and Users table exist
  const initializeDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          Username TEXT,
          Email TEXT UNIQUE,
          Password TEXT
        );`,
        [],
        () => console.log("Table created successfully"),
        (_, error) => console.log("Error creating table:", error)
      );
    });
  };

  // Validate login credentials
  const validateLogin = () => {
    if (email.length === 0 || password.length === 0) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Users WHERE Email = ? AND Password = ?",
        [email, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            const user = rows._array[0]; // Access user data safely
            Alert.alert("Success", `Welcome, ${user.Username}!`);
            navigation.navigate("editor");
          } else {
            Alert.alert("Error", "Invalid email or password.");
          }
        },
        (_, error) => {
          console.log("Error during login:", error);
          Alert.alert("Error", "Something went wrong during login.");
        }
      );
    });
  };

  React.useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Login</Text>

      {/* User Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="user-circle" size={80} color="#6C48C5" />
      </View>

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        onChangeText={(value) => setEmail(value)}
        value={email}
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        onChangeText={(value) => setPassword(value)}
        value={password}
      />

      {/* Login Button */}
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={validateLogin}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate("forgotPassword")}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Create Account */}
      <TouchableOpacity onPress={() => navigation.navigate("create")}>
        <Text style={styles.createAccount}>Create Account</Text>
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
  forgotPassword: {
    color: '#6C48C5',
    textAlign: 'center',
    marginTop: 15,
  },
  createAccount: {
    color: '#6C48C5',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;