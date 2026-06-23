/**
 * Card Details Screen
 * Shows detailed view of the health plan, coverage limit, and dependents.
 * Allows user to renew the card.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import AuthButton from '@/components/auth/AuthButton';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function CardDetailsScreen() {
  const { user, renewCard, isLoading } = useAuth();

  const handleRenew = async () => {
    Alert.alert(
      'Renew Card',
      'This will extend your card validity by 1 year. Proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Renew', 
          onPress: async () => {
            await renewCard();
            Alert.alert('Success', 'Card renewed successfully!');
          }
        }
      ]
    );
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan Information</Text>
          <DetailRow label="Plan Type" value="Family Floater Premium" />
          <DetailRow label="Status" value={user.cardStatus} />
          <DetailRow label="Validity" value={user.cardValidity} />
          <DetailRow label="Coverage Limit" value="₹5,00,000" isLast />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Member</Text>
          <DetailRow label="Name" value={user.fullName} />
          <DetailRow label="Mobile" value={`+91 ${user.mobile}`} />
          <DetailRow label="Gender" value={user.gender} />
          <DetailRow label="DOB" value={user.dateOfBirth} isLast />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dependents (Mock)</Text>
          <DetailRow label="Wife" value="Priya Sharma" />
          <DetailRow label="Son" value="Aarav Sharma" isLast />
        </View>

        <AuthButton 
          label="Renew Card" 
          onPress={handleRenew} 
          loading={isLoading}
          style={{ marginTop: spacing.md }}
        />

      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[styles.row, isLast && styles.lastRow]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  backArrow: { fontSize: 20, color: colors.text, marginRight: 4 },
  backText: { ...typography.body, color: colors.text, fontWeight: '500' },
  headerTitle: { ...typography.h3, color: colors.text },
  scroll: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  label: {
    ...typography.body,
    color: colors.subtext,
    flex: 1,
  },
  value: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },
});
