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
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

interface Transaction {
  id: string;
  type: 'deposit' | 'payment' | 'refund';
  title: string;
  description: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export default function WalletScreen() {
  const { user, updateUser } = useAuth();
  const [addAmount, setAddAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock transaction list
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-9023',
      type: 'refund',
      title: 'Claim #CLM-482 Refund',
      description: 'Reimbursement for Dental Treatment',
      amount: 15000,
      date: '2026-06-21',
      status: 'Completed',
    },
    {
      id: 'TXN-8812',
      type: 'payment',
      title: 'MedCred Card Premium',
      description: 'Annual active card fee payment',
      amount: 1200,
      date: '2026-06-18',
      status: 'Completed',
    },
    {
      id: 'TXN-7411',
      type: 'deposit',
      title: 'Added to Wallet',
      description: 'Deposit via UPI (PhonePe)',
      amount: 5000,
      date: '2026-06-18',
      status: 'Completed',
    },
  ]);

  const handleAddMoney = async () => {
    const amt = Number(addAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid deposit amount.');
      return;
    }

    setIsAdding(true);
    try {
      // Simulate payment gateway loading state
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const newBalance = (user?.walletBalance ?? 0) + amt;
      await updateUser({ walletBalance: newBalance });

      const newTxn: Transaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'deposit',
        title: 'Added to Wallet',
        description: 'Deposit via UPI payment',
        amount: amt,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
      };

      setTransactions((prev) => [newTxn, ...prev]);
      Alert.alert('Success', `₹${amt.toLocaleString()} successfully added to your MedCred Wallet.`);
      setAddAmount('');
      setShowAddForm(false);
    } catch (e) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const presetAmounts = [1000, 2000, 5000];

  // Filter refunds specifically
  const refundTransactions = transactions.filter((txn) => txn.type === 'refund');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MedCred Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>₹{(user?.walletBalance ?? 0).toLocaleString()}</Text>
          
          <TouchableOpacity
            style={styles.addMoneyBtn}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Ionicons name={showAddForm ? 'close' : 'add-circle'} size={20} color={colors.primary} />
            <Text style={styles.addMoneyBtnText}>
              {showAddForm ? 'Cancel Deposit' : 'Add Funds'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Money Input Area */}
        {showAddForm && (
          <View style={styles.addFormContainer}>
            <Text style={styles.formTitle}>Add Funds to Wallet</Text>
            
            <View style={styles.inputRow}>
              <Text style={styles.rupeeSymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter amount"
                placeholderTextColor={colors.subtext}
                value={addAmount}
                onChangeText={setAddAmount}
                keyboardType="numeric"
              />
            </View>

            {/* Presets */}
            <View style={styles.presetRow}>
              {presetAmounts.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={styles.presetChip}
                  onPress={() => setAddAmount(val.toString())}
                >
                  <Text style={styles.presetText}>+₹{val}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, isAdding && { opacity: 0.8 }]}
              onPress={handleAddMoney}
              disabled={isAdding}
            >
              {isAdding ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Ionicons name="wallet-outline" size={18} color={colors.white} />
                  <Text style={styles.submitBtnText}>Proceed to Pay</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Refunds Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Refunds</Text>
          <Text style={styles.sectionSubtitle}>
            Refunds from claim cancellations, cashless pre-auth deposits, or adjustments.
          </Text>

          {refundTransactions.length > 0 ? (
            refundTransactions.map((refund) => (
              <View key={refund.id} style={styles.refundCard}>
                <View style={styles.refundHeader}>
                  <View style={styles.refundIconWrap}>
                    <Ionicons name="receipt" size={18} color={colors.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.refundTitle}>{refund.title}</Text>
                    <Text style={styles.refundDate}>{refund.date}</Text>
                  </View>
                  <Text style={styles.refundAmount}>+₹{refund.amount.toLocaleString()}</Text>
                </View>
                <Text style={styles.refundDesc}>{refund.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent refunds processed.</Text>
          )}
        </View>

        {/* Transactions History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>

          {transactions.map((txn) => {
            const isDeposit = txn.type === 'deposit' || txn.type === 'refund';
            return (
              <View key={txn.id} style={styles.txnItem}>
                <View
                  style={[
                    styles.txnIconWrap,
                    { backgroundColor: isDeposit ? colors.secondaryLight : colors.dangerLight },
                  ]}
                >
                  <Ionicons
                    name={
                      txn.type === 'deposit'
                        ? 'arrow-down-circle'
                        : txn.type === 'refund'
                        ? 'refresh-circle'
                        : 'arrow-up-circle'
                    }
                    size={22}
                    color={isDeposit ? colors.secondary : colors.danger}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={styles.txnTitle}>{txn.title}</Text>
                  <Text style={styles.txnDesc}>{txn.description}</Text>
                  <Text style={styles.txnMeta}>
                    {txn.date} • {txn.id}
                  </Text>
                </View>
                <Text style={[styles.txnAmount, { color: isDeposit ? colors.secondary : colors.text }]}>
                  {isDeposit ? '+' : '-'}₹{txn.amount.toLocaleString()}
                </Text>
              </View>
            );
          })}
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
  balanceCard: {
    backgroundColor: colors.primary,
    margin: spacing.md,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.md,
  },
  addMoneyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  addMoneyBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  addFormContainer: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  rupeeSymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  presetRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  presetChip: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  submitBtn: {
    backgroundColor: colors.secondary,
    height: 44,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  submitBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.subtext,
    lineHeight: 16,
    marginBottom: spacing.md,
  },
  refundCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  refundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  refundIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  refundTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  refundDate: {
    fontSize: 11,
    color: colors.subtext,
  },
  refundAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  refundDesc: {
    fontSize: 12,
    color: colors.subtext,
    paddingLeft: 40,
  },
  txnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  txnIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txnTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  txnDesc: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  txnMeta: {
    fontSize: 10,
    color: colors.subtext,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 13,
    color: colors.subtext,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
});
