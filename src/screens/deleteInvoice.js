import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { initDatabase, getInvoices } from './databaseHelper';
import Checkbox from 'expo-checkbox';

const DeleteInvoiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { inventoryId } = route.params;

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await initDatabase();
        setDb(database);
        fetchInvoices(database);
      } catch (error) {
        console.error("Database setup error:", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };

    setupDatabase();
  }, []);

  const fetchInvoices = async (database) => {
    try {
      const result = await getInvoices(database);
      setInvoices(result || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      Alert.alert("Error", "Failed to load invoices");
    }
  };

  const handleSelectInvoice = (invoiceId) => {
    setSelectedInvoices(prev => {
      if (prev.includes(invoiceId)) {
        return prev.filter(id => id !== invoiceId);
      }
      return [...prev, invoiceId];
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedInvoices.length === 0) {
      Alert.alert("Error", "No invoices selected");
      return;
    }
  
    Alert.alert(
      "Delete Invoices",
      "Are you sure you want to delete the selected invoices? This will restore the quantities to the inventory.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              for (const invoiceId of selectedInvoices) {
                // Get invoice details before deletion
                const invoiceDetails = await db.getAllAsync(
                  'SELECT * FROM invoices WHERE id = ?',
                  [invoiceId]
                );
                const invoice = invoiceDetails[0];
  
                // Get invoice items
                const itemsResult = await db.getAllAsync(
                  'SELECT * FROM invoice_items WHERE invoice_id = ?',
                  [invoiceId]
                );
                const items = itemsResult;
  
                // Update inventory quantities
                for (const item of items) {
                  const quantityChange = invoice.type === 'sale' ? item.quantity : -item.quantity;
                  await db.runAsync(
                    'UPDATE items SET quantity = quantity + ? WHERE id = ?',
                    [quantityChange, item.item_id]
                  );
                }
  
                // Delete invoice items
                await db.runAsync(
                  'DELETE FROM invoice_items WHERE invoice_id = ?',
                  [invoiceId]
                );
  
                // Delete invoice
                await db.runAsync(
                  'DELETE FROM invoices WHERE id = ?',
                  [invoiceId]
                );
              }
  
              Alert.alert(
                "Success",
                "Selected invoices deleted successfully",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      fetchInvoices(db);
                      setSelectedInvoices([]);
                    }
                  }
                ]
              );
            } catch (error) {
              console.error("Error deleting invoices:", error);
              Alert.alert("Error", "Failed to delete invoices");
            }
          }
        }
      ]
    );
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Invoices</Text>

      <ScrollView style={styles.invoiceList}>
        {invoices.map((invoice) => (
          <View key={invoice.id} style={styles.invoiceItem}>
            <Checkbox
              value={selectedInvoices.includes(invoice.id)}
              onValueChange={() => handleSelectInvoice(invoice.id)}
              color={selectedInvoices.includes(invoice.id) ? '#6C48C5' : undefined}
            />
            <View style={styles.invoiceDetails}>
              <Text style={styles.invoiceNumber}>
                Invoice #{invoice.invoice_number}
              </Text>
              <Text style={styles.invoiceType}>
                Type: {invoice.type === 'sale' ? 'Sale' : 'Purchase'}
              </Text>
              <Text style={styles.invoiceDate}>
                Date: {formatDate(invoice.date)}
              </Text>
              <Text style={styles.invoiceTotal}>
                Total: ${Number(invoice.total_with_tax).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.deleteButton,
          selectedInvoices.length === 0 && styles.deleteButtonDisabled
        ]}
        onPress={handleDeleteSelected}
        disabled={selectedInvoices.length === 0}
      >
        <Text style={styles.deleteButtonText}>Delete Selected</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F7',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C48C5',
    textAlign: 'center',
    marginBottom: 16,
  },
  invoiceList: {
    flex: 1,
  },
  invoiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  invoiceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  invoiceType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  invoiceDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  invoiceTotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  deleteButtonDisabled: {
    backgroundColor: '#FFB0B0',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteInvoiceScreen; 