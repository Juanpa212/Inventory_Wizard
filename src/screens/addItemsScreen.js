import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const AddItemScreen = () => {
  const [category, setCategory] = useState(null);
  const [priority, setPriority] = useState(null);
  const [brand, setBrand] = useState(null);

  
  //Not sure if  necessary to track confirm yet 
  // const [confirm, setConfirm] = useState(false);

  const categoryData = [
    { label: "Stickers", value: "Stickers" },
    { label: "Books", value: "Books" },
    { label: "Clothing", value: "Clothing" },
  ];

  const priorityData = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const brandData = [
    { label: "Very_OK", value: "Very_OK" },
    { label: "Lil_Sad", value: "Lil_Sad" },
    { label: "CyberGoth", value: "CyberGoth" },
  ];



  // const onClickHandler = () => {
  //   console.log(categoryData)
  //   console.log(priorityData);
  //   console.log(brandData);
  // }
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Item</Text>

      {/* Name Field */}
      <Text style={styles.label}>
        Name<Text style={styles.required}>*</Text>
      </Text>
      <TextInput style={styles.input} placeholder="Enter item name" />

      {/* Quantity Field */}
      <Text style={styles.label}>
        Quantity<Text style={styles.required}>*</Text>
      </Text>
      <TextInput style={styles.input} placeholder="Enter quantity" keyboardType="numeric" />

      {/* Price Field */}
      <Text style={styles.label}>
        Price<Text style={styles.required}>*</Text>
      </Text>
      <TextInput style={styles.input} placeholder="Enter price" keyboardType="numeric" />

      {/* Category Dropdown */}
      <Text style={styles.label}>
        Category<Text style={styles.required}>*</Text>
      </Text>
      <Dropdown
        style={styles.dropdown}
        data={categoryData}
        labelField="label"
        valueField="value"
        placeholder="Select category"
        value={category}
        onChange={(item) => setCategory(item.value)}
      />

      {/* Priority Dropdown */}
      <Text style={styles.label}>
        Priority<Text style={styles.required}>*</Text>
      </Text>
      <Dropdown
        style={styles.dropdown}
        data={priorityData}
        labelField="label"
        valueField="value"
        placeholder="Select priority"
        value={priority}
        onChange={(item) => setPriority(item.value)}
      />

      {/* Brand Dropdown */}
      <Text style={styles.label}>
        Brand<Text style={styles.required}>*</Text>
      </Text>
      <Dropdown
        style={styles.dropdown}
        data={brandData}
        labelField="label"
        valueField="value"
        placeholder="Select brand"
        value={brand}
        onChange={(item) => setBrand(item.value)}
      />

      {/* Description Field */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea,styles.placeholderText]}
        placeholder="Enter item description..."
        multiline
        numberOfLines={4}
      />

      {/* Confirm Button */}
      <TouchableOpacity style={styles.button} onPress={onClickHandler}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>

      <Text style={styles.requiredText}>*Fields are required</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#6C48C5",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    width: "100%",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  required: {
    color: "red",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 5,
    color: "000"
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dropdown: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  requiredText: {
    fontSize: 16,
    color: "red",
    marginTop: 10,
    paddingBottom: 10,
    textAlign: "center",
  },
});

export default AddItemScreen;