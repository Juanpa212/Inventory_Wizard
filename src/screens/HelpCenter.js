import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAQItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity 
      style={styles.faqItem}
      onPress={toggleExpand}
      activeOpacity={0.7}
    >
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#FFFFFF"
        />
      </View>
      {expanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
      <View style={styles.separator} />
    </TouchableOpacity>
  );
};

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I add items?",
      answer: "From your inventory's main page, select manage items and then add item. This will take you to a page where you must enter the item's name, initial quantity, price, priority and category. After that press add item and your item will be added. You can decide to add another or view your inventory"
    },
    {
      question: "How do I delete items?",
      answer: "From your inventory's main page, select manage items and then delete item. Then simply select all the items you wish to delete and press delete selected at the bottom."
    },
    {
      question: "What are invoices used for?",
      answer: "Inventory Wizard automatically tracks any sale or restocking of items through the use of invoices. Once an invoice is created, your inventory is automatically updated depending on the information of the invoice."
    },
    {
      question: "How do I create invoices?",
      answer: "From your inventory's main page, select manage invoices, then press create invoice at the bottom of the screen. There you can fill out all the invoice's details like customer name, invoice number, date, ."
    }, 
    {
      question: "What does 'Item Priority' mean?",
      answer: "An item's priority defines how low an item's stock must be for it to appear in the Check Stock Levels page."
    },
    {
      question: "What is the difference between Low, Medium and High item priority?",
      answer: "An item with High priority will appear low on stock when it has fewer than 10 items, a Medimum priority item will appear with 6 or fewer items, and a Low priority item will appear with 4 or fewer items."
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      <Text style={styles.subTitle}>
        Find answers to commonly asked questions about Inventory Wizard
      </Text>
      <ScrollView style={styles.scrollView}>
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C48C5',
    paddingTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  subTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  faqItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    paddingRight: 16,
  },
  answerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  answerText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 8,
  },
});

export default HelpCenter;