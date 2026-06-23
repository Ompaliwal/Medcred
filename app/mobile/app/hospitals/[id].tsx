import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { MOCK_HOSPITALS } from './index';

export default function HospitalDetailsScreen() {
  const { id } = useLocalSearchParams();
  const hospital = MOCK_HOSPITALS.find((h) => h.id === id);

  if (!hospital) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Hospital not found.</Text>
        <TouchableOpacity style={styles.backBtnError} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    const url = `tel:${hospital.helpline.replace(/\s+/g, '')}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Calling is not supported on this device.');
        }
      })
      .catch((err) => console.error(err));
  };

  const handleDirections = () => {
    const query = encodeURIComponent(hospital.name + ', ' + hospital.location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {hospital.name}
        </Text>
        <TouchableOpacity style={styles.shareBtn} onPress={() => Alert.alert('Share', `Sharing hospital: ${hospital.name}`)}>
          <Ionicons name="share-social-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Area */}
        <View style={styles.banner}>
          <View style={styles.bannerOverlay} />
          <Ionicons name="business" size={64} color="rgba(255,255,255,0.7)" />
          <View style={styles.bannerInfo}>
            <View style={styles.badgeRow}>
              {hospital.isPartner ? (
                <View style={styles.partnerBadge}>
                  <Ionicons name="shield-checkmark" size={12} color={colors.white} />
                  <Text style={styles.partnerBadgeText}>Partner Network</Text>
                </View>
              ) : (
                <View style={[styles.partnerBadge, { backgroundColor: colors.subtext }]}>
                  <Text style={styles.partnerBadgeText}>Non-Partner</Text>
                </View>
              )}
              <View style={styles.distanceBadge}>
                <Ionicons name="navigate" size={12} color={colors.white} />
                <Text style={styles.distanceBadgeText}>{hospital.distance}</Text>
              </View>
            </View>
            <Text style={styles.bannerName}>{hospital.name}</Text>
          </View>
        </View>

        {/* Rating and Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statBox}>
            <Ionicons name="star" size={20} color="#FBBC04" />
            <Text style={styles.statValue}>{hospital.rating} / 5</Text>
            <Text style={styles.statLabel}>Patient Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="shield-checkmark" size={20} color={colors.secondary} />
            <Text style={styles.statValue}>{hospital.isPartner ? 'Cashless' : 'Reimbursement'}</Text>
            <Text style={styles.statLabel}>Claim Type</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="call" size={20} color={colors.primary} />
            <Text style={styles.statValue} numberOfLines={1}>24 / 7</Text>
            <Text style={styles.statLabel}>Emergency Helpline</Text>
          </View>
        </View>

        {/* Cashless/Pre-auth Eligibility Banner */}
        <View style={[styles.infoBanner, hospital.isPartner ? styles.infoBannerSuccess : styles.infoBannerWarning]}>
          <Ionicons
            name={hospital.isPartner ? 'checkmark-circle-outline' : 'warning-outline'}
            size={24}
            color={hospital.isPartner ? colors.secondary : colors.warning}
          />
          <View style={styles.infoBannerTextWrap}>
            <Text style={styles.infoBannerTitle}>
              {hospital.isPartner ? 'Cashless Claims Available' : 'Reimbursement Claim Only'}
            </Text>
            <Text style={styles.infoBannerSub}>
              {hospital.isPartner
                ? 'Get direct admission and treatment without upfront payments using your MedCred health card.'
                : 'Pay hospital directly and upload your discharge papers to get reimbursed within 7 days.'}
            </Text>
          </View>
        </View>

        {/* Contact details & Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Location</Text>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={20} color={colors.primary} style={styles.detailIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{hospital.address}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="call" size={20} color={colors.primary} style={styles.detailIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Emergency Helpline</Text>
              <Text style={styles.detailValue}>{hospital.helpline}</Text>
            </View>
          </View>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties Available</Text>
          <View style={styles.specialtiesGrid}>
            {hospital.specialties.map((spec, index) => (
              <View key={index} style={styles.specialtyItem}>
                <Ionicons name="medkit" size={16} color={colors.primary} />
                <Text style={styles.specialtyText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={handleCall}>
            <Ionicons name="call" size={20} color={colors.white} />
            <Text style={styles.actionBtnText}>Call Hospital</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={handleDirections}>
            <Ionicons name="map" size={20} color={colors.primary} />
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Pre-auth Start Claim */}
        {hospital.isPartner && (
          <TouchableOpacity
            style={styles.claimPreAuthBtn}
            onPress={() => router.push(`/claims/create?hospital=${encodeURIComponent(hospital.name)}`)}
          >
            <Ionicons name="document-text" size={20} color={colors.white} />
            <Text style={styles.claimPreAuthText}>Raise Pre-Auth Cashless Claim</Text>
          </TouchableOpacity>
        )}
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
  shareBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  banner: {
    height: 180,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 115, 232, 0.2)',
  },
  bannerInfo: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  partnerBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  distanceBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  bannerName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: 2,
  },
  infoBanner: {
    flexDirection: 'row',
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  infoBannerSuccess: {
    backgroundColor: colors.secondaryLight,
  },
  infoBannerWarning: {
    backgroundColor: colors.warningLight,
  },
  infoBannerTextWrap: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  infoBannerSub: {
    fontSize: 12,
    color: colors.subtext,
    lineHeight: 16,
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
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  detailIcon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontWeight: '500',
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  specialtyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  specialtyText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    borderWidth: 1,
  },
  actionBtnPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionBtnSecondary: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  claimPreAuthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    marginHorizontal: spacing.md,
    height: 48,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    ...shadows.sm,
  },
  claimPreAuthText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
