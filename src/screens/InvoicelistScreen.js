import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { initDatabase, getInvoices, getInvoiceDetails } from './databaseHelper';

const ViewInvoiceDetails = () => {
  const route = useRoute();
  const { inventoryId } = route.params;
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
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

  const handleInvoicePress = async (invoiceId) => {
    try {
      const details = await getInvoiceDetails(db, invoiceId);
      setSelectedInvoice(details);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      Alert.alert("Error", "Failed to load invoice details");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const InvoiceDetailModal = () => (
    <Modal
      visible={showDetails}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDetails(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Invoice Details</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDetails(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>General Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice Number:</Text>
                <Text style={styles.detailValue}>#{selectedInvoice.invoice_number}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{formatDate(selectedInvoice.date)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>
                  {selectedInvoice.type === 'sale' ? 'Sale' : 'Purchase'}
                </Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Items</Text>
              {selectedInvoice.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.item_name}</Text>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    <Text style={styles.itemPrice}>${Number(item.price_per_unit).toFixed(2)}</Text>
                    <Text style={styles.itemSubtotal}>${Number(item.subtotal).toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Totals</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Subtotal:</Text>
                <Text style={styles.detailValue}>
                  ${Number(selectedInvoice.total_amount).toFixed(2)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tax:</Text>
                <Text style={styles.detailValue}>
                  ${Number(selectedInvoice.tax_amount).toFixed(2)}
                </Text>
              </View>
              <View style={[styles.detailRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>
                  ${Number(selectedInvoice.total_with_tax).toFixed(2)}
                </Text>
              </View>
            </View>

            {selectedInvoice.notes && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notesText}>{selectedInvoice.notes}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoices</Text>

      <ScrollView style={styles.scrollView}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.invoiceNoHeader]}>Invoice #</Text>
          <Text style={[styles.headerText, styles.dateHeader]}>Date</Text>
          <Text style={[styles.headerText, styles.typeHeader]}>Type</Text>
          <Text style={[styles.headerText, styles.totalHeader]}>Total</Text>
        </View>

        {/* Table Rows */}
        {invoices.map((invoice) => (
          <TouchableOpacity
            key={invoice.id}
            style={styles.tableRow}
            onPress={() => handleInvoicePress(invoice.id)}
          >
            <Text style={[styles.cellText, styles.invoiceNoCell]}>
              {invoice.invoice_number}
            </Text>
            <Text style={[styles.cellText, styles.dateCell]}>
              {formatDate(invoice.date)}
            </Text>
            <Text style={[styles.cellText, styles.typeCell]}>
              {invoice.type === 'sale' ? 'Sale' : 'Purchase'}
            </Text>
            <Text style={[styles.cellText, styles.totalCell]}>
              ${Number(invoice.total_with_tax).toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedInvoice && <InvoiceDetailModal />}
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
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#6C48C5',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  invoiceNoHeader: {
    flex: 1.2,
  },
  dateHeader: {
    flex: 1.5,
    textAlign: 'center',
  },
  typeHeader: {
    flex: 0.8,
    textAlign: 'center',
  },
  totalHeader: {
    flex: 1,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
  invoiceNoCell: {
    flex: 1.2,
  },
  dateCell: {
    flex: 1.5,
    textAlign: 'center',
  },
  typeCell: {
    flex: 0.8,
    textAlign: 'center',
  },
  totalCell: {
    flex: 1,
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C48C5',
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 24,
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C48C5',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C48C5',
  },
  notesText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default ViewInvoiceDetails;