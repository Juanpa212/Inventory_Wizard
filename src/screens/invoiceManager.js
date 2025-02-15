import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const InvoiceManager = () => {
  //const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const invoices = [
    {
      id: 12345,
      time: '5:00pm',
      type: 'In',
      items: 5,
      categories: ['Stickers', 'Art', 'Clothes'],
      total: 111.50
    },
    {
      id: 32193,
      time: '8:56pm', 
      type: 'Out',
      items: 23,
      categories: ['Art'],
      total: 230.00
    },
    {
      id: 89281,
      time: '10:00am',
      type: 'Out',
      items: 2,
      categories: ['Fashion'],
      total: 50.00
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Invoice</Text>
      <View style={styles.searchContainer}>
      
        <TouchableOpacity style={styles.searchButton}>
          <MaterialCommunityIcons name="magnify" size={24} color="#FFF7F7" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.invoiceContainer}>
            <View>
              <Text style={styles.invoiceLabel}>Invoice no: {item.id}</Text>
              <Text style={styles.invoiceLabel}>Time: {item.time}</Text>
              <Text style={styles.invoiceLabel}>Invoice type: {item.type}</Text>
            </View>
            <View>
              <Text style={styles.invoiceLabel}>{item.items} items</Text>
              <Text style={styles.invoiceLabel}>{item.categories.join(', ')}</Text>
              <Text style={styles.invoiceLabel}>total = ${item.total.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.createButton}onPress = {() => navigation.navigate("createInvoice")}>
        <Text style={styles.createButtonText}>Create Invoice</Text>
        <MaterialCommunityIcons name="plus" size={24} color="#FFF7F7" />
        
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F7',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C48C5',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C48C5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#FFF7F7',
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 8,
  },
  invoiceContainer: {
    backgroundColor: '#6C48C5',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  invoiceLabel: {
    color: '#FFF7F7',
    fontSize: 14,
    marginBottom: 4,
  },
  createButton: {
    backgroundColor: '#6C48C5',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  createButtonText: {
    color: '#FFF7F7',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default InvoiceManager;