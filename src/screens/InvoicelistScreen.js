import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { initDatabase, getInvoiceDetails } from './databaseHelper';

const ViewInvoiceDetails = () => {
  const route = useRoute();
  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState(null);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await initDatabase();
        setDb(database);
        fetchInvoiceDetails(database);
      } catch (error) {
        console.error("Database setup error:", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };

    setupDatabase();
  }, []);

  const fetchInvoiceDetails = async (database) => {
    try {
      const result = await getInvoiceDetails(database, invoiceId);
      setInvoice(result);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      Alert.alert("Error", "Failed to load invoice details");
    }
  };

  if (!invoice) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoice Details</Text>

      <ScrollView style={styles.invoiceList}>
        <View style={styles.invoiceItem}>
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

        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Items</Text>
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.item_name}</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  ${Number(item.price_per_unit).toFixed(2)}
                </Text>
                <Text style={styles.itemSubtotal}>
                  ${Number(item.subtotal).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              ${Number(invoice.total_amount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text style={styles.totalValue}>
              ${Number(invoice.tax_amount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>
              ${Number(invoice.total_with_tax).toFixed(2)}
            </Text>
          </View>
        </View>

        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}
      </ScrollView>
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
  itemsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C48C5',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
    marginRight: 12,
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
    marginRight: 12,
  },
  itemSubtotal: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C48C5',
  },
  notesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  notesText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default ViewInvoiceDetails;