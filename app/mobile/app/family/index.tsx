/**
 * Family List Screen
 * Displays a list of family members linked to the user's account.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, FamilyMember } from '@/context/AuthContext';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function FamilyListScreen() {
  const { user } = useAuth();
  const familyMembers = user?.familyMembers || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Members</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {familyMembers.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="people" size={48} color={colors.subtext} />
            </View>
            <Text style={styles.emptyTitle}>No Family Members Yet</Text>
            <Text style={styles.emptySub}>
              Add your spouse, children, or parents to share your healthcare benefits.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {familyMembers.map((member: FamilyMember) => (
              <TouchableOpacity 
                key={member.id} 
                style={styles.memberCard}
                onPress={() => member.isVerified ? router.push({ pathname: '/family/[id]/card', params: { id: member.id } }) : null}
                activeOpacity={member.isVerified ? 0.7 : 1}
              >
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.fullName}</Text>
                  <Text style={styles.memberRel}>{member.relationship} • {member.gender}</Text>
                </View>
                
                {member.isVerified ? (
                  <View style={[styles.statusBadge, { backgroundColor: colors.secondary + '20' }]}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.secondary} />
                    <Text style={[styles.statusText, { color: colors.secondary }]}>Verified</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={[styles.statusBadge, { backgroundColor: colors.warning + '20' }]}
                    onPress={() => router.push({ pathname: '/family/verify', params: { id: member.id } })}
                  >
                    <Ionicons name="warning" size={14} color={colors.warning} />
                    <Text style={[styles.statusText, { color: colors.warning }]}>Pending</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/family/add')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={colors.white} />
      </TouchableOpacity>
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
    width: 60,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySub: {
    ...typography.body,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 22,
  },
  list: {
    gap: spacing.md,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  memberRel: {
    ...typography.caption,
    color: colors.subtext,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
