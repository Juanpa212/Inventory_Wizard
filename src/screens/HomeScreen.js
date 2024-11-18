import React from "react";
import { Text, StyleSheet, View, TouchaleOpacity } from "react-native";

const HomeScreen = (props) => {
  return (
    <View>
      <Text style={styles.text}>GO To login</Text>
      <TouchaleOpacity 
        onPress={() => props.navigation.navigate("loginScreen")}
        title="Go to LOGIN"
          />
  </View>);
};


const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
});

export default HomeScreen;
