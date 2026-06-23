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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

interface LoanApplication {
  id: string;
  amount: number;
  tenureMonths: number;
  emi: number;
  appliedDate: string;
  status: 'Pending' | 'Approved' | 'Disbursed' | 'Repaid';
  purpose: string;
}

export default function LoanScreen() {
  const { user } = useAuth();
  const [loanAmount, setLoanAmount] = useState('30000');
  const [tenure, setTenure] = useState<number>(6); // 3, 6, or 12 months
  const [purpose, setPurpose] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Mock list of applications
  const [loanHistory, setLoanHistory] = useState<LoanApplication[]>([
    {
      id: 'L-9842',
      amount: 15000,
      tenureMonths: 3,
      emi: 5000,
      appliedDate: '2025-11-10',
      status: 'Repaid',
      purpose: 'Dental Treatment',
    },
  ]);

  const [bypassActiveCard, setBypassActiveCard] = useState(false);

  // Card check dependency
  const isCardActive = user?.cardStatus === 'ACTIVE' || bypassActiveCard;

  // Calculate waiting period: Suppose 30 days from user creation
  // For demonstration, let's say the user signed up 18 days ago, so 12 days left
  const totalWaitingDays = 30;
  const daysElapsed = 18;
  const daysRemaining = totalWaitingDays - daysElapsed;
  const isWaitingPeriodOver = false; // Set to false to show waiting period UI with a "Skip/Bypass" toggle for testing

  const [bypassWaiting, setBypassWaiting] = useState(false);

  // Interest rate is 0% for MedCred India cashless cardholders
  const calculatedEmi = Math.round(Number(loanAmount) / tenure) || 0;

  const handleApply = async () => {
    const amt = Number(loanAmount);
    if (!amt || isNaN(amt) || amt < 5000 || amt > 100000) {
      Alert.alert('Validation Error', 'Loan amount must be between ₹5,000 and ₹1,00,000.');
      return;
    }
    if (!purpose.trim()) {
      Alert.alert('Validation Error', 'Please specify the medical purpose.');
      return;
    }

    setIsApplying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newLoan: LoanApplication = {
        id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: amt,
        tenureMonths: tenure,
        emi: calculatedEmi,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Approved',
        purpose: purpose,
      };
      setLoanHistory((prev) => [newLoan, ...prev]);
      Alert.alert('Application Approved!', `Your medical loan of ₹${amt.toLocaleString()} has been approved and pre-approved at 0% EMI.`);
      setPurpose('');
    } catch (e) {
      Alert.alert('Error', 'Application failed. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  // 1. Dependency Check Screen
  if (!isCardActive) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MedCred Loan</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.errorContent}>
          <View style={styles.errorIconWrap}>
            <Ionicons name="lock-closed" size={48} color={colors.danger} />
          </View>
          <Text style={styles.errorTitle}>Health Card Inactive</Text>
          <Text style={styles.errorSubtitle}>
            To apply for medical loans and credit, your MedCred Health Card must be ACTIVE. Please complete your KYC verification or activate your card to proceed.
          </Text>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/card')}>
            <Ionicons name="card-outline" size={20} color={colors.white} />
            <Text style={styles.actionBtnText}>View Card Status</Text>
          </TouchableOpacity>

          {/* Dev Bypass Workflow */}
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#4F46E5', marginTop: spacing.md }]} 
            onPress={() => setBypassActiveCard(true)}
          >
            <Ionicons name="construct" size={20} color={colors.white} />
            <Text style={styles.actionBtnText}>Dev: Assume Card Active</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Loans</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Waiting Period Section */}
        {!isWaitingPeriodOver && !bypassWaiting ? (
          <View style={styles.waitingCard}>
            <View style={styles.waitingHeader}>
              <Ionicons name="hourglass" size={24} color={colors.warning} />
              <Text style={styles.waitingTitle}>Waiting Period Active</Text>
            </View>
            <Text style={styles.waitingText}>
              Your MedCred card is subject to a standard {totalWaitingDays}-day waiting period before medical loan eligibility is fully unlocked.
            </Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(daysElapsed / totalWaitingDays) * 100}%` }]} />
            </View>
            <View style={styles.waitingFooter}>
              <Text style={styles.daysRemainingText}>{daysRemaining} days remaining</Text>
              <TouchableOpacity style={styles.bypassBtn} onPress={() => setBypassWaiting(true)}>
                <Text style={styles.bypassBtnText}>Simulate Bypass</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.eligibleBanner}>
            <Ionicons name="ribbon" size={24} color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.eligibleTitle}>Eligible for Medical Credit</Text>
              <Text style={styles.eligibleText}>
                No waiting period active. Apply for instant cashless treatment support at 0% Interest EMI.
              </Text>
            </View>
          </View>
        )}

        {/* 3. Loan Eligibility & Application Form */}
        {(isWaitingPeriodOver || bypassWaiting) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Apply for Cashless Loan</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Requested Amount (₹5,000 - ₹1,00,000)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.rupeeSymbol}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  value={loanAmount}
                  onChangeText={setLoanAmount}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>EMI Tenure Option</Text>
              <View style={styles.tenureRow}>
                {[3, 6, 12].map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.tenureChip, tenure === m && styles.tenureChipActive]}
                    onPress={() => setTenure(m)}
                  >
                    <Text style={[styles.tenureChipText, tenure === m && styles.tenureChipTextActive]}>
                      {m} Months
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Medical Purpose / Hospitalization Reason</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={purpose}
                  onChangeText={setPurpose}
                  placeholder="e.g. Surgery, Diagnostics, Treatment"
                />
              </View>
            </View>

            {/* Calculations Card */}
            <View style={styles.calculationCard}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Estimated Monthly EMI</Text>
                <Text style={styles.calcValue}>₹{calculatedEmi.toLocaleString()} / mo</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Interest Rate</Text>
                <Text style={[styles.calcValue, { color: colors.secondary }]}>0% (No Interest)</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, isApplying && { opacity: 0.8 }]}
              onPress={handleApply}
              disabled={isApplying}
            >
              {isApplying ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                  <Text style={styles.submitBtnText}>Submit Loan Request</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* 4. Loan History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Loan History & Applications</Text>

          {loanHistory.map((loan) => (
            <View key={loan.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyMeta}>
                  <Text style={styles.loanId}>{loan.id}</Text>
                  <Text style={styles.loanDate}>{loan.appliedDate}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        loan.status === 'Repaid'
                          ? colors.secondaryLight
                          : loan.status === 'Approved' || loan.status === 'Disbursed'
                          ? colors.primaryLight
                          : colors.warningLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          loan.status === 'Repaid'
                            ? colors.secondary
                            : loan.status === 'Approved' || loan.status === 'Disbursed'
                            ? colors.primary
                            : '#D97706',
                      },
                    ]}
                  >
                    {loan.status}
                  </Text>
                </View>
              </View>

              <View style={styles.historyDetails}>
                <View>
                  <Text style={styles.historyValue}>₹{loan.amount.toLocaleString()}</Text>
                  <Text style={styles.historyLabel}>Amount</Text>
                </View>
                <View>
                  <Text style={styles.historyValue}>{loan.tenureMonths} Months</Text>
                  <Text style={styles.historyLabel}>Tenure</Text>
                </View>
                <View>
                  <Text style={styles.historyValue}>₹{loan.emi.toLocaleString()} / mo</Text>
                  <Text style={styles.historyLabel}>EMI (0% interest)</Text>
                </View>
              </View>
              
              <Text style={styles.purposeText}>
                <Text style={{ fontWeight: '700' }}>Purpose: </Text>
                {loan.purpose}
              </Text>
            </View>
          ))}
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
  errorContainer: {
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
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  errorSubtitle: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    ...shadows.sm,
  },
  actionBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  waitingCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  waitingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  waitingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  waitingText: {
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: colors.warning,
    borderRadius: 3,
  },
  waitingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  daysRemainingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.subtext,
  },
  bypassBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  bypassBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  eligibleBanner: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  eligibleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  eligibleText: {
    fontSize: 12,
    color: colors.subtext,
    lineHeight: 16,
  },
  section: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  fieldRow: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
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
  },
  rupeeSymbol: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  tenureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tenureChip: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  tenureChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tenureChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.subtext,
  },
  tenureChipTextActive: {
    color: colors.white,
  },
  calculationCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: {
    fontSize: 13,
    color: colors.subtext,
  },
  calcValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  historySection: {
    marginTop: spacing.sm,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  historyMeta: {
    gap: 2,
  },
  loanId: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  loanDate: {
    fontSize: 12,
    color: colors.subtext,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  historyValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  historyLabel: {
    fontSize: 10,
    color: colors.subtext,
    textAlign: 'center',
    marginTop: 2,
  },
  purposeText: {
    fontSize: 12,
    color: colors.subtext,
  },
});
