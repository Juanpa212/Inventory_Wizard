import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Navigation</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("login")}>
        <Text style={styles.buttonText}>Go to Login Screen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("editor")}>
        <Text style={styles.buttonText}>Go to editor Screen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("start_1")}>
        <Text style={styles.buttonText}>Go to editor Screen</Text>
      </TouchableOpacity>
    </View>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C48C5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 0,
    marginBottom: 0,
    alignItems: "start",

  },
  button: {
    width: "80%",
    paddingVertical: 16,
    backgroundColor: "#FFF7F7",
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
    marginLeft: 0
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
});

export default HomeScreen;
