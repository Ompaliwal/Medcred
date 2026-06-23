/**
 * Welcome Screen — Landing page with Login and Register CTAs.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  { icon: '🏥', label: 'Hospital Network' },
  { icon: '💰', label: 'Loan Eligibility' },
  { icon: '📋', label: 'Easy Claims' },
  { icon: '👨‍👩‍👧', label: 'Family Plans' },
];

export default function WelcomeScreen() {
  const { login } = useAuth();
  const fadeIn   = useRef(new Animated.Value(0)).current;
  const slideUp  = useRef(new Animated.Value(40)).current;

  const handleDevLogin = async () => {
    const result = await login('1234567890', '123456');
    if (result.success) {
      router.replace('/(tabs)');
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, tension: 50, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Hero area */}
      <View style={styles.hero}>
        {/* Gradient-ish background layer */}
        <View style={styles.heroBg} />
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />

        {/* Logo */}
        <Animated.View style={[styles.logoWrap, { opacity: fadeIn }]}>
          <View style={styles.logoMark}>
            <View style={styles.crossV} />
            <View style={styles.crossH} />
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.logoText}>
            Med<Text style={styles.logoAccent}>Cred</Text>
          </Text>
          <Text style={styles.logoIndia}>INDIA</Text>
        </Animated.View>

        {/* Hero text */}
        <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
          <Text style={styles.heroTitle}>Your Complete{'\n'}Health Safety Net</Text>
          <Text style={styles.heroSub}>
            Affordable health cards, instant claims,{'\n'}and family protection — all in one app.
          </Text>
        </Animated.View>

        {/* Feature pills */}
        <Animated.View style={[styles.featureRow, { opacity: fadeIn }]}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featurePill}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Bottom CTA card */}
      <Animated.View style={[styles.ctaCard, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
        <Text style={styles.ctaTitle}>Get Started Today</Text>
        <Text style={styles.ctaSubtext}>
          Join thousands of families protected by MedCred India
        </Text>

        {/* Primary: Register */}
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.85}
        >
          <Text style={styles.registerBtnText}>Create Account</Text>
        </TouchableOpacity>

        {/* Secondary: Login */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.loginBtnText}>Already have an account? Login</Text>
        </TouchableOpacity>

        {/* Tertiary: Dev Login */}
        <TouchableOpacity
          style={styles.devLoginBtn}
          onPress={handleDevLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.devLoginBtnText}>Dev Login (Bypass OTP)</Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Hero ──
  hero: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryDark,
    opacity: 0.3,
  },
  heroCircle1: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -width * 0.2,
    right: -width * 0.15,
  },
  heroCircle2: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -width * 0.15,
    left: -width * 0.1,
  },

  // Logo
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  crossV: {
    position: 'absolute',
    width: 10,
    height: 36,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  crossH: {
    position: 'absolute',
    width: 36,
    height: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  logoDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    backgroundColor: colors.warning,
    borderRadius: 7,
    top: 6,
    right: 6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  logoAccent: {
    color: colors.warning,
  },
  logoIndia: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 5,
    fontWeight: '500',
  },

  // Hero text
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 38,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  heroSub: {
    ...typography.body,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },

  // Feature pills row
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  featureIcon: {
    fontSize: 14,
  },
  featureLabel: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '500',
  },

  // ── CTA Card ──
  ctaCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 36,
    gap: spacing.sm,
  },
  ctaTitle: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: 2,
  },
  ctaSubtext: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  registerBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  loginBtn: {
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  loginBtnText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  devLoginBtn: {
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    marginTop: 4,
  },
  devLoginBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  terms: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.subtext,
    lineHeight: 18,
    marginTop: 4,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
});
