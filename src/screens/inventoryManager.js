import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const InventoryScreen = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}>
          <MaterialCommunityIcons name="package-variant" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Manage Items</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
            onPress={() => navigation.navigate("invoiceManager")}>
          <MaterialCommunityIcons name="file-document" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Manage Invoices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
            onPress={() => navigation.navigate("stock")}>
          <MaterialCommunityIcons name="chart-line" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Check Stock Levels</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}>
          <MaterialCommunityIcons name="cog" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Inventory Settings</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.helpButton, { backgroundColor: '#6C48C5' }]}
        onPress={() => navigation.navigate("help")}>
        <Text style={styles.buttonText}>Help</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C48C5',
    marginBottom: 24,
    textAlign: 'center',
    position: "absolute",
    top: 32
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF7F7',
    fontSize: 16,
    marginTop: 8,
  },
  helpButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default InventoryScreen;