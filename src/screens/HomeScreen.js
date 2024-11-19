import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View styly={styles.container}>

      <Text style={styles.title}>Navigation</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("login")}>
        <Text style={styles.buttonText}>Go to Login Screen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("editor")}>
        <Text style={styles.buttonText}>Go to editor Screen</Text>
      </TouchableOpacity>
    </View>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
    marginLeft: 30
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
});

export default HomeScreen;
