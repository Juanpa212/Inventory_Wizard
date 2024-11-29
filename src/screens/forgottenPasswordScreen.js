import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const PasswordForgot = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Inventory Wizard</Text>
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome name="exclamation-circle" size={50} color="#6C48C5" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.description}>
          Enter your email and we’ll send you a link to reset your password.
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="Enter your email" />
        </View>

        {/* Error Message */}
        <Text style={styles.errorText}>We cannot find your email.</Text>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity onPress={()=> {navigation.navigate("login")}} style={styles.backToLogin}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C48C5", // Purple background
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  header: {
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  card: {
    width: "90%",
    backgroundColor: "#FFFFFF", // White card background
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6C48C5", // Purple text
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F9FAFB", // Light background for input
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#374151",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444", // Red text for error message
    marginBottom: 20,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#6C48C5", // Purple button
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backToLogin: {
    marginTop: 10,
  },
  backToLoginText: {
    fontSize: 14,
    color: "#6C48C5", // Purple text for back to login link
    textDecorationLine: "underline",
  },
  footer: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default PasswordForgot;
