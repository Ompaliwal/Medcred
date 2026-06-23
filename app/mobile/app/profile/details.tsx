/**
 * Personal Details Screen (Read-Only)
 * Shows all user details fetched during registration/KYC.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function PersonalDetailsScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <DetailRow label="Full Name" value={user?.fullName} />
          <DetailRow label="Date of Birth" value={user?.dateOfBirth} />
          <DetailRow label="Gender" value={user?.gender} />
          <DetailRow label="Mobile Number" value={`+91 ${user?.mobile}`} />
          <DetailRow label="Email Address" value={user?.email} isLast />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Address Details</Text>
          <DetailRow label="Full Address" value={user?.address} />
          <DetailRow label="City" value={user?.city} />
          <DetailRow label="State" value={user?.state} />
          <DetailRow label="Pincode" value={user?.pincode} isLast />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Identity Verification</Text>
          <DetailRow 
            label="Aadhaar Number" 
            value={user?.aadhaarNumber ? `XXXX XXXX ${user.aadhaarNumber.slice(-4)}` : 'N/A'} 
          />
          <View style={[detailStyles.row, { borderBottomWidth: 0 }]}>
            <Text style={detailStyles.label}>KYC Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{user?.cardStatus?.replace('_', ' ')}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, isLast = false }: { label: string; value?: string; isLast?: boolean }) {
  return (
    <View style={[detailStyles.row, isLast && detailStyles.lastRow]}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value || 'Not provided'}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    ...typography.body,
    color: colors.subtext,
    flex: 1,
  },
  value: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
    flex: 1.5,
    textAlign: 'right',
  },
});

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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  backArrow: {
    fontSize: 20,
    color: colors.primary,
    marginRight: 4,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  card: {
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
    marginBottom: spacing.sm,
  },
  statusBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusBadgeText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '700',
  },
});
