import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const InvoiceManager = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Invoice</Text>
        <TouchableOpacity>
          <Text style={styles.headerButton}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Form */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Customer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="Customer" />
            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={24} color="#6C48C5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Invoice #</Text>
              <TextInput style={styles.inputDetail} placeholder="32726" />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Currency</Text>
              <TextInput style={styles.inputDetail} placeholder="$ USD" />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date</Text>
              <TextInput style={styles.inputDetail} placeholder="10 Aug 2022" />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Due</Text>
              <TextInput style={styles.inputDetail} placeholder="10 Aug 2022" />
            </View>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comments</Text>
          <TouchableOpacity style={styles.addButton}>
            <FontAwesome name="plus-circle" size={20} color="#6C48C5" />
            <Text style={styles.addButtonText}>Add Comments</Text>
          </TouchableOpacity>
        </View>

        {/* Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          <TouchableOpacity style={styles.addButton}>
            <FontAwesome name="plus-circle" size={20} color="#6C48C5" />
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub Total</Text>
              <Text style={styles.summaryValue}>$0</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>$0</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount Paid</Text>
              <Text style={styles.summaryValue}>$0</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.amountDueLabel]}>Amount Due</Text>
              <Text style={[styles.summaryValue, styles.amountDueValue]}>$0</Text>
            </View>
          </View>
        </View>

        {/* Terms & Conditions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <TextInput
            style={styles.termsInput}
            placeholder="Enter terms and conditions..."
            multiline
          >
            Do full payment within 45 days.
          </TextInput>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#6C48C5",
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButton: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6C48C5",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F9FAFB",
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    width: "48%",
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },
  inputDetail: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#F9FAFB",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    color: "#6C48C5",
    marginLeft: 10,
  },
  summaryContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    color: "#000000",
  },
  amountDueLabel: {
    fontWeight: "bold",
  },
  amountDueValue: {
    fontWeight: "bold",
    color: "#EF4444", // Red to emphasize due amount
  },
  termsInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#F9FAFB",
    fontSize: 14,
    color: "#374151",
    minHeight: 80,
    textAlignVertical: "top",
  },
});

export default InvoiceManager;
