import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import user icon

const createAccountScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Create your account</Text>

      {/* User Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="user-circle" size={80} color="#0000" />
      </View>

      {/* Username Input */}
      <Text style={styles.label}>Username</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter username" 
      />

    <Text style={styles.label}>Email /Phone Number</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter Email / Phone Number" 
      />
      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter password" 
        secureTextEntry 
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => {navigation.navigate("forgor")}}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Create Account */}
      <TouchableOpacity onPress={() => {navigation.navigate("create")}}>
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
    color: '#000000',
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

export default createAccountScreen;
