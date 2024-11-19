import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const InventoryEditor = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.employeeViewButton}>
          <Text style={styles.employeeViewText}>Employee View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Inventory Name</Text>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Hinted search text"
          style={styles.searchInput}
        />
        <MaterialIcons name="search" size={24} color="#888" />
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="pen" size={24} color="#000" />
          <Text style={styles.buttonText}>Manage Items</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="box-open" size={24} color="#000" />
          <Text style={styles.buttonText}>Manage Invoices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="bar-chart-outline" size={24} color="#000" />
          <Text style={styles.buttonText}>Check Stock Levels</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="information-circle-outline" size={24} color="#000" />
          <Text style={styles.buttonText}>Inventory Data</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={24} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="boxes" size={24} color="#000" />
          <Text style={styles.navText}>Items</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="receipt-outline" size={24} color="#000" />
          <Text style={styles.navText}>Invoices</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#000" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  employeeViewButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  employeeViewText: {
    fontSize: 14,
    color: '#000',
  },
  helpButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 150
  },
  button: {
    width: '48%',
    backgroundColor: '#e0e0e0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
    paddingBottom: 16,
    marginTop: 130
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default InventoryEditor;
