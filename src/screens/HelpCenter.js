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
      answer: "To add items, tap the + button in the bottom right corner of the main screen. Fill in the required details like item name, quantity and category. You can also add an optional image by tapping the camera icon."
    },
    {
      question: "How do I add team members?",
      answer: "Go to Settings > Team Management > Add Member. Enter their email address and select their role (Admin/Member). They will receive an invitation email to join your Inventory Wizard workspace."
    },
    {
      question: "How do I generate reports?",
      answer: "Navigate to the Reports tab, select the desired date range and report type (Inventory Summary, Stock Movement, etc.). Tap Generate to create your report. You can export it as PDF or CSV."
    },
    {
      question: "How do I set low stock alerts?",
      answer: "Open an item details, scroll to Stock Settings and set the minimum quantity. When stock falls below this level, you will receive a notification. You can manage all alerts in Settings > Notifications."
    },
    {
      question: "How do I categorize items?",
      answer: "You can create and manage categories in Settings > Categories. When adding or editing an item, select the appropriate category from the dropdown menu. Items can belong to multiple categories."
    }
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