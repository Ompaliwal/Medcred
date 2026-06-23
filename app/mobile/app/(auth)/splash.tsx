/**
 * Splash Screen — Animated logo + tagline, auto-navigates to onboarding.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { colors, typography, spacing } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoOpacity   = useRef(new Animated.Value(0)).current;
  const logoScale     = useRef(new Animated.Value(0.7)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY      = useRef(new Animated.Value(20)).current;
  const dotScale1     = useRef(new Animated.Value(0)).current;
  const dotScale2     = useRef(new Animated.Value(0)).current;
  const dotScale3     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: logo fade-in → tagline slide-up → dots → navigate
    Animated.sequence([
      // Logo entrance
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Short pause
      Animated.delay(200),
      // Tagline slides up
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Loading dots staggered
      Animated.delay(400),
      Animated.stagger(150, [
        Animated.spring(dotScale1, { toValue: 1, useNativeDriver: true }),
        Animated.spring(dotScale2, { toValue: 1, useNativeDriver: true }),
        Animated.spring(dotScale3, { toValue: 1, useNativeDriver: true }),
      ]),
      // Hold for effect
      Animated.delay(700),
    ]).start(() => {
      router.replace('/(auth)/onboarding');
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Background gradient circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Logo area */}
      <Animated.View
        style={[
          styles.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        {/* MedCred logo mark */}
        <View style={styles.logoMark}>
          <View style={styles.crossV} />
          <View style={styles.crossH} />
          <View style={styles.logoInner} />
        </View>

        <Text style={styles.logoText}>
          Med<Text style={styles.logoAccent}>Cred</Text>
        </Text>
        <Text style={styles.logoTagInner}>India</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={[
          styles.taglineWrap,
          {
            opacity: taglineOpacity,
            transform: [{ translateY: taglineY }],
          },
        ]}
      >
        <Text style={styles.tagline}>Your Digital Health Companion</Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.dotsRow}>
        {[dotScale1, dotScale2, dotScale3].map((anim, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { transform: [{ scale: anim }] }]}
          />
        ))}
      </View>

      {/* Bottom branding */}
      <Text style={styles.bottomTag}>Powered by MedCred India Pvt. Ltd.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Decorative background blobs
  circle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -width * 0.25,
    right: -width * 0.25,
  },
  circle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -width * 0.15,
    left: -width * 0.2,
  },
  // Logo
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoMark: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  crossV: {
    position: 'absolute',
    width: 12,
    height: 44,
    backgroundColor: colors.white,
    borderRadius: 6,
  },
  crossH: {
    position: 'absolute',
    width: 44,
    height: 12,
    backgroundColor: colors.white,
    borderRadius: 6,
  },
  logoInner: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    top: 8,
    right: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  logoAccent: {
    color: colors.warning,
  },
  logoTagInner: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 6,
    fontWeight: '500',
    marginTop: 2,
  },
  // Tagline
  taglineWrap: {
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  // Loading dots
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  // Bottom
  bottomTag: {
    position: 'absolute',
    bottom: spacing.xl,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.3,
  },
});
