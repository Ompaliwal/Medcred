import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

type ClaimStatus = 'All' | 'Submitted' | 'UnderReview' | 'Approved' | 'Rejected';

export default function ClaimsListScreen() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<ClaimStatus>('All');

  const claims = user?.claims || [];

  const filteredClaims = claims.filter((claim) => {
    if (selectedFilter === 'All') return true;
    return claim.status === selectedFilter;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved':
        return { bg: colors.secondaryLight, text: colors.secondary, icon: 'checkmark-circle' };
      case 'Rejected':
        return { bg: colors.dangerLight, text: colors.danger, icon: 'close-circle' };
      case 'UnderReview':
      case 'Submitted':
      default:
        return { bg: colors.warningLight, text: '#D97706', icon: 'time' };
    }
  };

  const renderItem = ({ item }: { item: typeof claims[0] }) => {
    const statusInfo = getStatusStyle(item.status);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => router.push(`/claims/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrapper, { backgroundColor: item.type === 'Hospital' ? '#EEF2F6' : '#FAF5FF' }]}>
            <Ionicons
              name={item.type === 'Hospital' ? 'business' : 'home'}
              size={22}
              color={item.type === 'Hospital' ? colors.primary : '#7C3AED'}
            />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.cardTitle}>{item.type} Claim</Text>
            <Text style={styles.cardSubtitle}>
              {item.hospitalName ? item.hospitalName : 'Home Care Treatment'}
            </Text>
          </View>
          <Text style={styles.amountText}>₹{item.amount.toLocaleString()}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            <Ionicons name="calendar-outline" size={13} color={colors.subtext} /> {item.treatmentDate}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Ionicons name={statusInfo.icon as any} size={14} color={statusInfo.text} />
            <Text style={[styles.statusBadgeText, { color: statusInfo.text }]}>
              {item.status === 'UnderReview' ? 'Under Review' : item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filterOptions: ClaimStatus[] = ['All', 'Submitted', 'UnderReview', 'Approved', 'Rejected'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Claims</Text>
          <Text style={styles.headerSubtitle}>{claims.length} total claims</Text>
        </View>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={() => router.push('/claims/create')}>
          <Ionicons name="add" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Row */}
      <View style={styles.filterWrapper}>
        <FlatList
          horizontal
          data={filterOptions}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = selectedFilter === item;
            let displayLabel = item as string;
            if (item === 'UnderReview') displayLabel = 'In Review';
            return (
              <TouchableOpacity
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedFilter(item)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {displayLabel}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredClaims}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.disabledText} />
            <Text style={styles.emptyTitle}>No Claims Found</Text>
            <Text style={styles.emptySubtitle}>
              You do not have any claims under the selected filter.
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/claims/create')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: 1,
    fontWeight: '500',
  },
  addHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterWrapper: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterList: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl + 60,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.subtext,
    marginTop: 2,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dateText: {
    fontSize: 12,
    color: colors.subtext,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
});
