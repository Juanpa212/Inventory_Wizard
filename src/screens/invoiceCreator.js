import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { initDatabase, generateInvoiceNumber, createInvoice } from './databaseHelper';

const InvoiceCreator = ({ route, navigation }) => {
  const { inventoryId } = route.params;
  const TAX_RATE = 0.13; // 13% tax rate

  const [db, setDb] = useState(null);
  const [items, setItems] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [invoiceType, setInvoiceType] = useState('sale'); // 'sale' or 'purchase'
  const [notes, setNotes] = useState('');
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await initDatabase();
        setDb(database);
        const number = await generateInvoiceNumber(database);
        setInvoiceNumber(number);
        fetchItems(database);
      } catch (error) {
        console.error("Database setup error:", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };

    setupDatabase();
  }, []);

  const fetchItems = async (database) => {
    try {
      const result = await database.getAllAsync(
        'SELECT * FROM items WHERE inventory_id = ?',
        [inventoryId]
      );
      setItems(result || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to load items.");
    }
  };

  const handleAddItem = (item) => {
    if (item.quantity <= 0 && invoiceType === 'sale') {
      Alert.alert("Error", "This item is out of stock");
      return;
    }

    setSelectedItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, {
        ...item,
        quantity: 1
      }];
    });
  };

  const handleUpdateItemQuantity = (itemId, quantity) => {
    const item = items.find(i => i.id === itemId);
    const numQuantity = parseInt(quantity) || 0;

    if (invoiceType === 'sale' && numQuantity > item.quantity) {
      Alert.alert("Error", "Quantity exceeds available stock");
      return;
    }

    setSelectedItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: numQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0);
    const taxAmount = subtotal * TAX_RATE;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleCreateInvoice = async () => {
    if (selectedItems.length === 0) {
      Alert.alert("Error", "Please add at least one item to the invoice");
      return;
    }

    setIsLoading(true);

    try {
      const { subtotal, taxAmount, total } = calculateTotals();

      const invoiceData = {
        invoice_number: invoiceNumber,
        type: invoiceType,
        items: selectedItems,
        total_amount: subtotal,
        tax_amount: taxAmount,
        total_with_tax: total,
        notes: notes.trim()
      };

      await createInvoice(db, invoiceData);
      
      Alert.alert(
        "Success",
        "Invoice created successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error("Error creating invoice:", error);
      Alert.alert("Error", "Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const ItemSelector = () => (
    <Modal
      visible={showItemSelector}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowItemSelector(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Items</Text>
          <ScrollView style={styles.itemList}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemButton}
                onPress={() => handleAddItem(item)}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  Price: ${item.price.toFixed(2)} | Available: {item.quantity}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowItemSelector(false)}
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Create Invoice</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Invoice Number</Text>
          <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>

          <Text style={styles.label}>Invoice Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                invoiceType === 'sale' && styles.typeButtonActive
              ]}
              onPress={() => setInvoiceType('sale')}
            >
              <Text style={styles.typeButtonText}>Sale</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                invoiceType === 'purchase' && styles.typeButtonActive
              ]}
              onPress={() => setInvoiceType('purchase')}
            >
              <Text style={styles.typeButtonText}>Purchase</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addItemButton}
            onPress={() => setShowItemSelector(true)}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
            <Text style={styles.addItemButtonText}>Add Items</Text>
          </TouchableOpacity>

          {selectedItems.map((item) => (
            <View key={item.id} style={styles.selectedItem}>
              <View style={styles.selectedItemHeader}>
                <Text style={styles.selectedItemName}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  style={styles.removeButton}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
              <View style={styles.itemControls}>
                <TextInput
                  style={styles.quantityInput}
                  value={item.quantity.toString()}
                  onChangeText={(text) => handleUpdateItemQuantity(item.id, text)}
                  keyboardType="numeric"
                />
                <Text style={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.notesContainer}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes (optional)"
              multiline
            />
          </View>

          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax (13%):</Text>
              <Text style={styles.totalValue}>${taxAmount.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.createButton,
              (isLoading || selectedItems.length === 0) && styles.createButtonDisabled
            ]}
            onPress={handleCreateInvoice}
            disabled={isLoading || selectedItems.length === 0}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? 'Creating...' : 'Create Invoice'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ItemSelector />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#6C48C5',
    padding: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 18,
    color: '#6C48C5',
    marginBottom: 16,
    fontWeight: '600',
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#6C48C5',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  typeButtonActiveText: {
    color: '#FFFFFF',
  },
  addItemButton: {
    backgroundColor: '#6C48C5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addItemButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  itemList: {
    maxHeight: 400,
  },
  itemButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#6C48C5',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedItem: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  selectedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  itemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityInput: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    width: 80,
    borderWidth: 1,
    borderColor: '#DDD',
    textAlign: 'center',
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notesContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  notesInput: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 8,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    fontSize: 16,
  },
  totalsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingTop: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#6C48C5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonDisabled: {
    backgroundColor: '#9B89D9',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default InvoiceCreator;