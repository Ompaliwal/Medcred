/**
 * Main Profile Screen (Tab View)
 * Displays user overview and menu options.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Header Profile Info */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.profilePhoto && user.profilePhoto.startsWith('mock://') ? (
            <View style={styles.avatarPlaceholderImage}>
              <Text style={{ fontSize: 40 }}>👤</Text>
            </View>
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{user?.fullName?.[0] ?? 'U'}</Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user?.fullName ?? 'User Name'}</Text>
        <Text style={styles.userMobile}>+91 {user?.mobile ?? 'XXXXXXXXXX'}</Text>
        
        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{user?.cardStatus?.replace('_', ' ') ?? 'UNKNOWN'}</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/details')}>
          <View style={styles.menuIconContainer}><Text style={styles.menuIcon}>📋</Text></View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Personal Details</Text>
            <Text style={styles.menuSubtitle}>View your personal info and KYC details</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/edit')}>
          <View style={styles.menuIconContainer}><Text style={styles.menuIcon}>✏️</Text></View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Edit Profile</Text>
            <Text style={styles.menuSubtitle}>Update your avatar, email, and address</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}><Text style={styles.menuIcon}>📞</Text></View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Help & Support</Text>
            <Text style={styles.menuSubtitle}>Contact MedCred support</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 48,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
  },
  avatarPlaceholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  userName: {
    ...typography.h2,
    color: colors.white,
    marginBottom: 4,
  },
  userMobile: {
    ...typography.body,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.md,
  },
  statusBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '700',
  },
  menuContainer: {
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    color: colors.subtext,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.subtext,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: colors.subtext,
    paddingHorizontal: spacing.xs,
  },
  logoutBtn: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.dangerLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  logoutText: {
    ...typography.body,
    color: colors.danger,
    fontWeight: '700',
  },
});
