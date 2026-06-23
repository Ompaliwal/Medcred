import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

export default function ClaimDetailScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();

  const claim = user?.claims?.find((c) => c.id === id);

  if (!claim) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Claim not found.</Text>
        <TouchableOpacity style={styles.backBtnError} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return { bg: colors.secondaryLight, text: colors.secondary, label: 'Approved' };
      case 'Rejected':
        return { bg: colors.dangerLight, text: colors.danger, label: 'Rejected' };
      case 'UnderReview':
        return { bg: colors.warningLight, text: '#D97706', label: 'Under Review' };
      case 'Submitted':
      default:
        return { bg: colors.primaryLight, text: colors.primary, label: 'Submitted' };
    }
  };

  const statusStyle = getStatusColor(claim.status);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Claim details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Claim Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={[styles.typeBadge, { backgroundColor: claim.type === 'Hospital' ? '#EEF2F6' : '#FAF5FF' }]}>
              <Ionicons
                name={claim.type === 'Hospital' ? 'business' : 'home'}
                size={16}
                color={claim.type === 'Hospital' ? colors.primary : '#7C3AED'}
              />
              <Text style={[styles.typeBadgeText, { color: claim.type === 'Hospital' ? colors.primary : '#7C3AED' }]}>
                {claim.type === 'Hospital' ? 'Hospital Care' : 'Home Treatment'}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
            </View>
          </View>

          <Text style={styles.amountText}>₹{claim.amount.toLocaleString()}</Text>
          <Text style={styles.amountLabel}>Estimated Claim Value</Text>

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            {claim.hospitalName && (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Hospital</Text>
                <Text style={styles.gridValue}>{claim.hospitalName}</Text>
              </View>
            )}
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Treatment Date</Text>
              <Text style={styles.gridValue}>{claim.treatmentDate}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Claim ID</Text>
              <Text style={styles.gridValue}>#{claim.id}</Text>
            </View>
          </View>
        </View>

        {/* Timeline Tracking Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Claim Timeline</Text>
          <View style={styles.timelineContainer}>
            {claim.timeline.map((item, idx) => {
              const isLast = idx === claim.timeline.length - 1;
              return (
                <View key={idx} style={styles.timelineRow}>
                  <View style={styles.timelineIndicator}>
                    <View style={styles.dot}>
                      <View style={styles.dotInner} />
                    </View>
                    {!isLast && <View style={styles.line} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineStep}>{item.step}</Text>
                    <Text style={styles.timelineDate}>
                      {new Date(item.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Uploaded Documents List */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Supporting Documents</Text>
            <Text style={styles.docCount}>{claim.documents?.length || 0} Attached</Text>
          </View>

          {claim.documents && claim.documents.length > 0 ? (
            <View style={styles.docList}>
              {claim.documents.map((doc, idx) => (
                <View key={idx} style={styles.docCard}>
                  <Ionicons name="document-text" size={24} color={colors.primary} />
                  <View style={styles.docInfo}>
                    <Text style={styles.docName} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text style={styles.docStatus}>Uploaded successfully</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={18} color={colors.secondary} />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyDocsCard}>
              <Ionicons name="cloud-upload-outline" size={40} color={colors.disabledText} />
              <Text style={styles.emptyDocsText}>No documents uploaded yet</Text>
              <Text style={styles.emptyDocsSub}>
                Upload your bills or prescriptions to process this claim.
              </Text>
            </View>
          )}
        </View>

        {/* Upload Action Button */}
        <TouchableOpacity
          style={styles.uploadBtn}
          activeOpacity={0.8}
          onPress={() => router.push(`/claims/upload?id=${claim.id}`)}
        >
          <Ionicons name="cloud-upload" size={20} color="#fff" />
          <Text style={styles.uploadBtnText}>Upload More Documents</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  backBtnError: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: '600',
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
  summaryCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  amountText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  amountLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  detailsGrid: {
    gap: spacing.md,
  },
  gridItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 13,
    color: colors.subtext,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
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
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  docCount: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  timelineContainer: {
    marginTop: spacing.md,
    paddingLeft: spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timelineIndicator: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: -2,
    marginBottom: -6,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  timelineStep: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  docList: {
    gap: spacing.sm,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  docInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  docName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  docStatus: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: 2,
  },
  emptyDocsCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  emptyDocsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptyDocsSub: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: 2,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    height: 48,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    ...shadows.sm,
  },
  uploadBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
