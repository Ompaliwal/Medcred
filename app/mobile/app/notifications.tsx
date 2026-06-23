/**
 * Notifications Screen
 * Shows all in-app notifications with read/unread state,
 * type badges and a mark-all-read action.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/constants/theme';
import type { AppNotification } from '@/context/AuthContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Claim Approved ✅',
    message: 'Your hospital claim of ₹45,000 for Apollo Hospitals has been approved and is being processed for settlement.',
    date: '2026-06-23',
    isRead: false,
    type: 'SUCCESS',
  },
  {
    id: 'n2',
    title: 'KYC Verification Pending',
    message: 'Your Aadhaar documents are under review. This usually takes 24–48 hours. We will notify you once complete.',
    date: '2026-06-22',
    isRead: false,
    type: 'WARNING',
  },
  {
    id: 'n3',
    title: 'Health Card Activated',
    message: 'Congratulations! Your MedCred Health Card is now active. You can use it at any of our 500+ partner hospitals.',
    date: '2026-06-21',
    isRead: true,
    type: 'SUCCESS',
  },
  {
    id: 'n4',
    title: 'Loan Application Update',
    message: 'Your medical loan application is being reviewed. You will receive a decision within 2 business days.',
    date: '2026-06-20',
    isRead: true,
    type: 'INFO',
  },
  {
    id: 'n5',
    title: 'Family Member Added',
    message: 'Your spouse has been successfully added to your MedCred Family Plan. They can now avail cashless benefits.',
    date: '2026-06-19',
    isRead: true,
    type: 'SUCCESS',
  },
  {
    id: 'n6',
    title: 'Wallet Credited',
    message: 'Your wallet has been credited with ₹5,000 as a refund for your cancelled claim #CLM-004.',
    date: '2026-06-18',
    isRead: true,
    type: 'INFO',
  },
];

function typeConfig(type: AppNotification['type']) {
  switch (type) {
    case 'SUCCESS':
      return { icon: 'checkmark-circle' as const, color: '#059669', bg: '#ECFDF5', label: 'Success' };
    case 'WARNING':
      return { icon: 'warning' as const,          color: '#D97706', bg: '#FFFBEB', label: 'Alert'   };
    default:
      return { icon: 'information-circle' as const, color: '#1A73E8', bg: '#EEF4FF', label: 'Info'  };
  }
}

function relativeDate(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const { user } = useAuth();

  // Merge mock data with any real notifications from context
  const all: AppNotification[] = [
    ...(user?.notifications ?? []),
    ...MOCK_NOTIFICATIONS.filter((m) => !(user?.notifications ?? []).some((n) => n.id === m.id)),
  ];

  const [read, setRead] = useState<Set<string>>(
    new Set(all.filter((n) => n.isRead).map((n) => n.id)),
  );

  const markAllRead = () => setRead(new Set(all.map((n) => n.id)));
  const markRead    = (id: string) => setRead((prev) => new Set([...prev, id]));

  const unread = all.filter((n) => !read.has(n.id)).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unread} new</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead} disabled={unread === 0}>
          <Text style={[styles.markAllText, unread === 0 && { color: '#D1D5DB' }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {all.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={56} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>You're all caught up! Check back later.</Text>
          </View>
        ) : (
          all.map((notif, i) => {
            const isRead = read.has(notif.id);
            const cfg    = typeConfig(notif.type);
            return (
              <TouchableOpacity
                key={notif.id}
                style={[styles.card, !isRead && styles.cardUnread]}
                activeOpacity={0.75}
                onPress={() => markRead(notif.id)}
              >
                {/* Unread stripe */}
                {!isRead && <View style={styles.unreadStripe} />}

                <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                  <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                </View>

                <View style={styles.content}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, !isRead && styles.titleUnread]} numberOfLines={1}>
                      {notif.title}
                    </Text>
                    <View style={[styles.typePill, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.typeText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.message} numberOfLines={2}>{notif.message}</Text>
                  <Text style={styles.date}>{relativeDate(notif.date)}</Text>
                </View>

                {!isRead && <View style={styles.dotIndicator} />}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 8,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1C1C1E' },
  unreadBadge: { backgroundColor: colors.danger, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  unreadBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  markAllBtn: { paddingHorizontal: 6 },
  markAllText: { fontSize: 12, fontWeight: '700', color: colors.primary },

  // List
  list: { padding: spacing.md, gap: 10, paddingBottom: 60 },

  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'flex-start',
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardUnread: {
    borderColor: '#BFDBFE',
    backgroundColor: '#FAFCFF',
  },
  unreadStripe: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  content: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: 13, fontWeight: '600', color: '#374151' },
  titleUnread: { fontWeight: '800', color: '#1C1C1E' },
  typePill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: '700' },
  message: { fontSize: 12, color: '#6B7280', lineHeight: 17 },
  date: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  dotIndicator: {
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: colors.primary,
    alignSelf: 'center',
    flexShrink: 0,
  },

  // Empty
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: '#374151' },
  emptySub:   { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
});
