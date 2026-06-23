/**
 * Family Member Health Card Screen
 * Visual representation of the Health Card for a specific family member.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function FamilyMemberCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const member = user?.familyMembers.find((m) => m.id === id);

  const handleDownload = () => {
    Alert.alert('Card Downloaded', 'The Health Card has been saved to your device gallery.');
  };

  if (!user || !member) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{member.fullName}'s Card</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* The Card */}
        <View style={styles.cardContainer}>
          {/* Decorative Background Elements */}
          <View style={styles.cardCircle1} />
          <View style={styles.cardCircle2} />

          <View style={styles.cardTop}>
            <Text style={styles.cardLogo}>MedCred</Text>
            <View style={styles.cardTopRight}>
              <Ionicons name="wifi" size={20} color="rgba(255,255,255,0.5)" style={{ transform: [{ rotate: '90deg' }] }} />
              <Text style={styles.cardType}>Dependent</Text>
            </View>
          </View>
          
          <View style={styles.cardMiddle}>
            <Text style={styles.cardNumberLabel}>MedCred ID</Text>
            <Text style={styles.cardNumber}>{member.id}</Text>
          </View>

          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardLabel}>Cardholder Name</Text>
              <Text style={styles.cardValue}>{member.fullName}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardLabel}>Valid Thru</Text>
              <Text style={styles.cardValue}>{user.cardValidity ? user.cardValidity.substring(0, 7).replace('-', '/') : '12/25'}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/card/qr', params: { id: member.id } })}>
            <View style={[styles.actionIconWrap, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="qr-code" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionLabel}>QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
            <View style={[styles.actionIconWrap, { backgroundColor: colors.secondaryLight }]}>
              <Ionicons name="download" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.actionLabel}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/card/details', params: { id: member.id } })}>
            <View style={[styles.actionIconWrap, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="information-circle" size={24} color={colors.warning} />
            </View>
            <Text style={styles.actionLabel}>Details</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeaderRow}>
            <Ionicons name="shield-checkmark" size={20} color={colors.secondary} />
            <Text style={styles.infoTitle}>How to use this card?</Text>
          </View>
          <Text style={styles.infoText}>
            Present this digital card or the QR code at any of our network hospitals to avail cashless health benefits for your dependent.
          </Text>
        </View>

        {/* Additional Content */}
        <View style={styles.extraSection}>
          <TouchableOpacity style={styles.extraRow} onPress={() => router.push('/hospitals')}>
            <View style={[styles.extraIconBg, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="business" size={20} color="#7C3AED" />
            </View>
            <View style={styles.extraTextCol}>
              <Text style={styles.extraTitle}>Network Hospitals</Text>
              <Text style={styles.extraSub}>Browse cashless partner hospitals near you</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.extraRow} onPress={() => router.push('/support')}>
            <View style={[styles.extraIconBg, { backgroundColor: '#CFFAFE' }]}>
              <Ionicons name="call" size={20} color="#0891B2" />
            </View>
            <View style={styles.extraTextCol}>
              <Text style={styles.extraTitle}>24/7 Helpline</Text>
              <Text style={styles.extraSub}>Call us for claim assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
        </View>

      </ScrollView>
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
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  // Card UI
  cardContainer: {
    backgroundColor: '#0f172a', // deep premium dark
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    marginBottom: spacing.xl,
    minHeight: 220,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.03)',
    top: -50,
    right: -80,
  },
  cardCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -40,
    left: -40,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  cardLogo: {
    ...typography.h2,
    color: colors.white,
    fontStyle: 'italic',
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardType: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardMiddle: {
    marginVertical: spacing.md,
  },
  cardNumberLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 22,
    color: colors.white,
    letterSpacing: 2,
    fontWeight: '600',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  cardValue: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
  },
  // Actions
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  // Info Card
  infoCard: {
    backgroundColor: '#F8FAFC',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.xs,
  },
  infoTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  infoText: {
    ...typography.caption,
    color: colors.subtext,
    lineHeight: 20,
    paddingLeft: 28, // align with text after icon
  },
  // Extra Section
  extraSection: {
    gap: spacing.sm,
  },
  extraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  extraIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  extraTextCol: {
    flex: 1,
  },
  extraTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  extraSub: {
    ...typography.caption,
    color: colors.subtext,
  },
});
