/**
 * KYC Pending Screen — Post-registration success page.
 * Shows card status, next steps, and expected timeline.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');

const TIMELINE_STEPS = [
  {
    status: 'done',
    icon: '✅',
    title: 'Account Created',
    desc: 'Your account has been successfully created.',
    color: colors.secondary,
  },
  {
    status: 'done',
    icon: '📱',
    title: 'Mobile Verified',
    desc: 'Your mobile number has been verified.',
    color: colors.secondary,
  },
  {
    status: 'active',
    icon: '🔍',
    title: 'KYC Under Review',
    desc: 'Our team is reviewing your Aadhaar details. This takes 24–48 hours.',
    color: colors.warning,
  },
  {
    status: 'pending',
    icon: '✅',
    title: 'KYC Approved',
    desc: 'Your identity will be confirmed upon successful review.',
    color: colors.border,
  },
  {
    status: 'pending',
    icon: '💳',
    title: 'Health Card Activated',
    desc: 'Your MedCred card will be generated and activated.',
    color: colors.border,
  },
];

export default function KYCPendingScreen() {
  const { user } = useAuth();
  const fadeIn   = useRef(new Animated.Value(0)).current;
  const slideUp  = useRef(new Animated.Value(30)).current;
  const bounce   = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(bounce, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeIn,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleGoHome = () => {
    // Navigate to main tabs (dashboard) once the main app is built
    router.replace('/(tabs)');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Success illustration */}
      <View style={styles.topSection}>
        <View style={styles.heroBg} />
        <View style={styles.heroCircle} />

        <Animated.View style={[styles.successBadge, { transform: [{ scale: bounce }] }]}>
          <Text style={styles.successEmoji}>🎉</Text>
        </Animated.View>

        <Animated.Text style={[styles.heroTitle, { opacity: fadeIn }]}>
          Registration{'\n'}Successful!
        </Animated.Text>
        <Animated.Text style={[styles.heroSub, { opacity: fadeIn }]}>
          Welcome to MedCred India, {user?.fullName?.split(' ')[0] ?? 'there'}!
        </Animated.Text>
      </View>

      {/* Status card */}
      <Animated.View
        style={[styles.statusCard, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}
      >
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>KYC PENDING</Text>
          </View>
          <Text style={styles.statusTime}>Expected: 24–48 hrs</Text>
        </View>

        <Text style={styles.statusDesc}>
          Your application is now under review. You'll receive an SMS and notification once your KYC is approved and your health card is activated.
        </Text>

        {/* User details */}
        {user && (
          <View style={styles.detailsBox}>
            <DetailRow label="Name"         value={user.fullName} />
            <DetailRow label="Mobile"       value={`+91 ${user.mobile}`} />
            <DetailRow label="Email"        value={user.email} />
            <DetailRow label="Application"  value={user.id} mono />
          </View>
        )}
      </Animated.View>

      {/* Timeline */}
      <Animated.View style={[styles.section, { opacity: fadeIn }]}>
        <Text style={styles.sectionTitle}>Application Progress</Text>
        {TIMELINE_STEPS.map((step, i) => (
          <View key={i} style={styles.timelineRow}>
            {/* Icon column */}
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.timelineIcon,
                  step.status === 'done'    && styles.timelineIconDone,
                  step.status === 'active'  && styles.timelineIconActive,
                  step.status === 'pending' && styles.timelineIconPending,
                ]}
              >
                <Text style={styles.timelineEmoji}>
                  {step.status === 'done' ? '✓' : step.status === 'active' ? '●' : '○'}
                </Text>
              </View>
              {i < TIMELINE_STEPS.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    step.status === 'done' && styles.timelineLineDone,
                  ]}
                />
              )}
            </View>
            {/* Content */}
            <View style={styles.timelineContent}>
              <Text
                style={[
                  styles.timelineTitle,
                  step.status === 'active'  && { color: colors.warning },
                  step.status === 'done'    && { color: colors.secondary },
                  step.status === 'pending' && { color: colors.subtext },
                ]}
              >
                {step.title}
                {step.status === 'active' && (
                  <Text style={styles.activeTag}> • In Progress</Text>
                )}
              </Text>
              <Text style={styles.timelineDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* What to do while waiting */}
      <Animated.View style={[styles.section, { opacity: fadeIn }]}>
        <Text style={styles.sectionTitle}>While you wait…</Text>
        <View style={styles.tipsGrid}>
          {[
            { icon: '📋', title: 'Explore Plans', desc: 'Browse Individual & Family plans' },
            { icon: '🏥', title: 'Hospital Network', desc: 'See our partner hospitals' },
            { icon: '📞', title: 'Need Help?', desc: 'Contact our support team' },
          ].map((tip, i) => (
            <View key={i} style={styles.tipCard}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDesc}>{tip.desc}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Actions */}
      <Animated.View style={[styles.actions, { opacity: fadeIn }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleGoHome}>
          <Text style={styles.primaryBtnText}>Go to Dashboard →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.secondaryBtnText}>Login to Existing Account</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.footer}>
        MedCred India — Your trusted health partner 🇮🇳
      </Text>
    </ScrollView>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={detailStyles.row}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={[detailStyles.value, mono && detailStyles.mono]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { ...typography.caption, color: colors.subtext, fontWeight: '500' },
  value: { ...typography.caption, color: colors.text, fontWeight: '600', flex: 1, textAlign: 'right' },
  mono: { fontFamily: 'monospace', fontSize: 11, color: colors.primary },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 48 },

  // Hero
  topSection: {
    backgroundColor: colors.secondary,
    paddingTop: 72,
    paddingBottom: 48,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  heroCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -width * 0.3,
    right: -width * 0.2,
  },
  successBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successEmoji: { fontSize: 50 },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: spacing.sm,
  },
  heroSub: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  // Status card
  statusCard: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statusBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  statusBadgeText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusTime: {
    ...typography.caption,
    color: colors.subtext,
  },
  statusDesc: {
    ...typography.body,
    color: colors.subtext,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  detailsBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
  },

  // Timeline
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: 4,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIconDone: { backgroundColor: colors.secondary },
  timelineIconActive: { backgroundColor: colors.warning },
  timelineIconPending: { backgroundColor: colors.border },
  timelineEmoji: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 4,
    minHeight: 32,
  },
  timelineLineDone: { backgroundColor: colors.secondary },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineTitle: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: 2,
  },
  activeTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  timelineDesc: {
    ...typography.caption,
    lineHeight: 18,
  },

  // Tips grid
  tipsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tipCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    gap: 4,
  },
  tipIcon: { fontSize: 24, marginBottom: 4 },
  tipTitle: { ...typography.caption, fontWeight: '700', color: colors.text, textAlign: 'center' },
  tipDesc: { ...typography.caption, color: colors.subtext, textAlign: 'center', lineHeight: 16 },

  // Actions
  actions: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  secondaryBtnText: { color: colors.primary, fontSize: 15, fontWeight: '600' },

  footer: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.subtext,
    paddingBottom: spacing.lg,
  },
});
