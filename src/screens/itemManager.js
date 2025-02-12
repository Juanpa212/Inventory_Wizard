import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const ItemManagerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { inventoryId } = route.params;

  

  return (
    <View style={styles.container}>
      {/* Inventory Name at the Top */}
      <Text style={styles.title}>Item Manager</Text>

      {/* 4-Button Grid in the Middle */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("add", { inventoryId })}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("deleteItem", { inventoryId })}
        >
          <MaterialCommunityIcons name="trash" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Delete Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("editItem", { inventoryId })}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Edit Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonContainer, { backgroundColor: '#6C48C5' }]}
          onPress={() => navigation.navigate("inventoryManager", { inventoryId })}
        >
          <MaterialCommunityIcons name="eye" size={24} color="#FFF7F7" />
          <Text style={styles.buttonText}>Manage Inventory</Text>
        </TouchableOpacity>
      </View>

      {/* Help Button at the Bottom */}
      <TouchableOpacity 
        style={[styles.helpButton, { backgroundColor: '#6C48C5' }]}
        onPress={() => navigation.navigate("help")}
      >
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
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C48C5',
    textAlign: 'center',
    position: 'absolute',
    top: 50,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150, // Adjust this value to center the buttons vertically
  },
  buttonContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 16,
    margin: 8,
    width: '45%', // Adjust width for a 2x2 grid
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
    position: 'absolute',
    bottom: 50,
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

export default ItemManagerScreen;