import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          Username TEXT,
          Email TEXT UNIQUE,
          Password TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Users table created successfully");
    } catch (error) {
      console.error("Error creating table:", error);
      Alert.alert(
        "Database Error",
        "There was an error initializing the app. Please restart the app."
      );
    }
  };

  const validateLogin = async () => {
    if (!db) {
      Alert.alert("Error", "Database not initialized. Please try again.");
      return;
    }

    if (email.trim().length === 0 || password.trim().length === 0) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const results = await db.getAllAsync(
        "SELECT * FROM Users WHERE Email = ? AND Password = ?",
        [email.trim(), password.trim()]
      );

      if (results && results.length > 0) {
        Alert.alert("Success", `Welcome, ${results[0].Username}!`);
        navigation.navigate("editor");
      } else {
        Alert.alert("Error", "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Something went wrong during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.iconContainer}>
        <FontAwesome name="user-circle" size={80} color="#6C48C5" />
      </View>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
        editable={!isLoading}
        autoCapitalize="none"
        autoComplete="email"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        editable={!isLoading}
        autoCapitalize="none"
      />

      <TouchableOpacity 
        style={[
          styles.loginButton,
          isLoading && styles.loginButtonDisabled
        ]} 
        onPress={validateLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("forgotPassword")}
        disabled={isLoading}
      >
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("create")}
        disabled={isLoading}
      >
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
  loginButtonDisabled: {
    backgroundColor: '#9B89D9',
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