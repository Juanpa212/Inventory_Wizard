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
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.questionContainer}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>{question}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
      <View style={styles.separator} />
    </View>
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
      <Text style={styles.header}>Help Center</Text>
      <Text style={styles.subHeader}>
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
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  faqItem: {
    paddingHorizontal: 16,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    paddingRight: 16,
  },
  answerContainer: {
    paddingBottom: 16,
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});

export default HelpCenter;