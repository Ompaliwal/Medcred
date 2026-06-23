import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: 'How do I use my MedCred Health Card?',
    answer: 'Simply show your active MedCred Health Card at any of our partner hospitals during admission. The hospital will initiate a cashless pre-authorization claim using your Card ID.',
  },
  {
    question: 'What is the waiting period for medical loans?',
    answer: 'Standard medical credit and loans have a 30-day waiting period from the date of card activation. However, emergency pre-approved cashless claims at partner hospitals can bypass this check.',
  },
  {
    question: 'How long does a reimbursement claim approval take?',
    answer: 'Once you upload all required documents (discharge summary, bills, and payment receipts), reimbursement claims are reviewed and processed within 7 working days.',
  },
  {
    question: 'Can I add multiple family members?',
    answer: 'Yes! You can add dependent family members (spouse, children, parents) through the Family Management tab. Each member will require a mobile OTP verification to verify identity.',
  },
];

export default function SupportScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('KYC');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['KYC', 'Claims', 'Loans', 'Card', 'Other'];

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleCallSupport = () => {
    const phone = '+9118001025050';
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmailSupport = () => {
    const email = 'support@medcred.in';
    const subjectLine = 'MedCred Mobile App Support';
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subjectLine)}`);
  };

  const handleRaiseTicket = async () => {
    if (!subject.trim()) {
      Alert.alert('Validation Error', 'Please enter a ticket subject.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please provide a detailed description of your issue.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate ticket creation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert(
        'Ticket Created!',
        `Your support ticket regarding "${subject}" has been successfully logged. Our team will contact you within 24 hours.`
      );
      setSubject('');
      setDescription('');
    } catch (e) {
      Alert.alert('Error', 'Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support & Help</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Help Banner */}
        <View style={styles.helpBanner}>
          <Text style={styles.helpBannerTitle}>How can we help you today?</Text>
          <Text style={styles.helpBannerSub}>
            Get instant answers to FAQs, raise a support ticket, or connect with our helpline agents.
          </Text>
        </View>

        {/* Contact Widgets Row */}
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactBox} onPress={handleCallSupport}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#E6F4EA' }]}>
              <Ionicons name="call" size={20} color={colors.secondary} />
            </View>
            <Text style={styles.contactLabel}>Call Helpline</Text>
            <Text style={styles.contactValue}>1800 102 5050</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactBox} onPress={handleEmailSupport}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#E8F0FE' }]}>
              <Ionicons name="mail" size={20} color={colors.primary} />
            </View>
            <Text style={styles.contactLabel}>Email Support</Text>
            <Text style={styles.contactValue}>support@medcred.in</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQ_DATA.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <View key={index} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  activeOpacity={0.7}
                  onPress={() => toggleFaq(index)}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.subtext}
                  />
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Raise Ticket Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Raise a Support Ticket</Text>
          <Text style={styles.sectionSubtitle}>
            Can't find what you need? Describe your problem and we will get back to you.
          </Text>

          {/* Ticket Category Selector */}
          <Text style={styles.fieldLabel}>Select Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat) => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Subject Field */}
          <Text style={styles.fieldLabel}>Subject / Topic</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={subject}
              onChangeText={setSubject}
              placeholder="e.g. KYC verification pending"
              placeholderTextColor={colors.subtext}
            />
          </View>

          {/* Description Field */}
          <Text style={styles.fieldLabel}>Detailed Description</Text>
          <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start', paddingTop: spacing.sm }]}>
            <TextInput
              style={[styles.textInput, { textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Please provide details about the issue you are facing..."
              placeholderTextColor={colors.subtext}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && { opacity: 0.8 }]}
            onPress={handleRaiseTicket}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <>
                <Ionicons name="send" size={16} color={colors.white} />
                <Text style={styles.submitBtnText}>Submit Ticket</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  helpBanner: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  helpBannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  helpBannerSub: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  contactBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  contactIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '600',
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  faqCard: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    paddingRight: spacing.md,
  },
  faqAnswerContainer: {
    marginTop: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: 8,
  },
  categoryScroll: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  textInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    ...shadows.sm,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
