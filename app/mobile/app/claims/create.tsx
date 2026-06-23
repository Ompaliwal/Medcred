import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

export default function CreateClaimScreen() {
  const { createClaim } = useAuth();
  const params = useLocalSearchParams();

  const [type, setType] = useState<'Hospital' | 'HomeTreatment'>('Hospital');
  const [hospitalName, setHospitalName] = useState('');
  const [treatmentDate, setTreatmentDate] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.hospital) {
      setHospitalName(params.hospital as string);
      setType('Hospital');
    }
    // Set today's date as default in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    setTreatmentDate(today);
  }, [params.hospital]);

  const handleSubmit = async () => {
    if (type === 'Hospital' && !hospitalName.trim()) {
      Alert.alert('Validation Error', 'Please enter the hospital name.');
      return;
    }
    if (!treatmentDate.trim()) {
      Alert.alert('Validation Error', 'Please specify the treatment date.');
      return;
    }
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount greater than zero.');
      return;
    }

    setIsSubmitting(true);
    const claimData = {
      type,
      hospitalName: type === 'Hospital' ? hospitalName : undefined,
      treatmentDate,
      amount: Number(amount),
    };

    try {
      // Simulate slight network delay for premium feel
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const claimId = await createClaim(claimData);
      Alert.alert('Success', 'Claim created successfully. Please upload supporting documents now.');
      router.replace(`/claims/${claimId}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to submit claim. Please try again.');
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
        <Text style={styles.headerTitle}>New Claim</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionHeading}>Enter Treatment Details</Text>
        <Text style={styles.sectionSubtitle}>
          Provide treatment details to initiate your claim verification.
        </Text>

        {/* Claim Type Selector */}
        <View style={styles.fieldRow}>
          <Text style={styles.label}>Claim Type</Text>
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'Hospital' && styles.typeBtnActive]}
              onPress={() => setType('Hospital')}
            >
              <Ionicons
                name="business"
                size={18}
                color={type === 'Hospital' ? colors.white : colors.primary}
              />
              <Text style={[styles.typeBtnText, type === 'Hospital' && styles.typeBtnTextActive]}>
                Hospital
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeBtn, type === 'HomeTreatment' && styles.typeBtnActive]}
              onPress={() => setType('HomeTreatment')}
            >
              <Ionicons
                name="home"
                size={18}
                color={type === 'HomeTreatment' ? colors.white : colors.primary}
              />
              <Text style={[styles.typeBtnText, type === 'HomeTreatment' && styles.typeBtnTextActive]}>
                Home Treatment
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conditional Hospital Name Input */}
        {type === 'Hospital' && (
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Hospital Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={20} color={colors.subtext} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={hospitalName}
                onChangeText={setHospitalName}
                placeholder="Search or enter hospital name"
                placeholderTextColor={colors.subtext}
              />
            </View>
          </View>
        )}

        {/* Treatment Date Input */}
        <View style={styles.fieldRow}>
          <Text style={styles.label}>Treatment Date</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="calendar-outline" size={20} color={colors.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={treatmentDate}
              onChangeText={setTreatmentDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.subtext}
            />
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.fieldRow}>
          <Text style={styles.label}>Total Estimated Amount (₹)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="cash-outline" size={20} color={colors.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              placeholderTextColor={colors.subtext}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoCardText}>
            You will be asked to upload hospital bills, pre-auth forms, or discharge summary documents after creating the claim.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && { opacity: 0.8 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Submit & Continue</Text>
            </>
          )}
        </TouchableOpacity>
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
  scrollContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing.lg,
  },
  fieldRow: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  typeToggle: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: spacing.xs,
    backgroundColor: colors.white,
  },
  typeBtnActive: {
    backgroundColor: colors.primary,
  },
  typeBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  typeBtnTextActive: {
    color: colors.white,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoCardText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 16,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    ...shadows.md,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
