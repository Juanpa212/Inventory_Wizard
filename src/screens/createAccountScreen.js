import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const createAccountScreen = ({ navigation }) => {
  const [userName, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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
          Username TEXT NOT NULL,
          Password TEXT NOT NULL,
          Email TEXT UNIQUE NOT NULL,
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const checkEmailExists = async (email) => {
    try {
      const results = await db.getAllAsync(
        'SELECT id FROM Users WHERE Email = ?',
        [email.trim()]
      );
      return results && results.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      throw error;
    }
  };

  const insertUser = async (username, password, email) => {
    try {
      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      console.log('Inserting user with values:', {
        username: trimmedUsername,
        email: trimmedEmail,
        passwordLength: trimmedPassword.length
      });

      if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
        throw new Error("All fields are required");
      }

      const query = `
        INSERT INTO Users (Username, Password, Email) 
        VALUES ("${trimmedUsername}", "${trimmedPassword}", "${trimmedEmail}")
      `;

      console.log('Executing query:', query);
      
      await db.execAsync(query);
      console.log('User inserted successfully');
    } catch (error) {
      console.error("Error in insertUser:", error);
      throw error;
    }
  };

  const handleCreateAccount = async () => {
    if (isLoading || !db) {
      console.log('Early return due to:', { isLoading, hasDB: !!db });
      return;
    }

    console.log('Starting account creation with values:', {
      username: userName,
      email,
      passwordLength: password.length
    });

    if (!userName || userName.trim() === "") {
      Alert.alert("Error", "Username is required");
      return;
    }

    if (!email || email.trim() === "") {
      Alert.alert("Error", "Email is required");
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!password || !validatePassword(password)) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const emailExists = await checkEmailExists(email);
      
      if (emailExists) {
        Alert.alert("Error", "This email is already registered.");
        return;
      }

      await insertUser(userName, password, email);
      
      Alert.alert(
        "Success",
        "Account created successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("StartScreen"),
          },
        ]
      );
    } catch (error) {
      console.error("Error creating account:", error);
      Alert.alert(
        "Error",
        "There was an error creating your account. Please try again."
      );
    } finally {
      setIsLoading(false);
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
        placeholder="Enter username (min 6 chars, 1 special char)"
        value={userName}
        onChangeText={setUser}
        editable={!isLoading}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.hint}>Must be at least 6 characters with 1 special character</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter gmail or outlook email"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
      />
      <Text style={styles.hint}>Must be a Gmail or Outlook email address</Text>

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password (min 6 chars)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.hint}>Must be at least 6 characters long</Text>

      <TouchableOpacity 
        style={[
          styles.loginButton,
          isLoading && styles.loginButtonDisabled
        ]} 
        onPress={handleCreateAccount}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Text>
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
    hint: {
    fontSize: 12,
    color: '#666',
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 5,
  },
});

export default createAccountScreen;