/**
 * Login Screen — Mobile number entry with India +91 prefix.
 * On submit, navigates to OTP verification screen.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import AuthButton from '@/components/auth/AuthButton';
import AuthInput from '@/components/auth/AuthInput';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function LoginScreen() {
  const { sendOTP, isLoading } = useAuth();
  const [mobile, setMobile]   = useState('');
  const [error, setError]     = useState('');

  const validate = (): boolean => {
    if (!mobile) {
      setError('Mobile number is required.');
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSendOTP = async () => {
    if (!validate()) return;

    const result = await sendOTP(mobile);
    if (result.success) {
      // Pass mobile to OTP screen via query param
      router.push({ pathname: '/(auth)/otp-verify', params: { mobile, flow: 'login' } });
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSmall}>
            <View style={styles.crossV} />
            <View style={styles.crossH} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Enter your registered mobile number to receive a secure OTP.
          </Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login with OTP</Text>

          {/* Mobile field */}
          <View style={styles.mobileRow}>
            {/* Country code badge */}
            <View style={styles.countryBadge}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.countryCode}>+91</Text>
            </View>
            <View style={styles.mobileInputWrap}>
              <AuthInput
                label="Mobile Number"
                required
                placeholder="98XXXXXXXX"
                value={mobile}
                onChangeText={v => { setMobile(v.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                keyboardType="number-pad"
                maxLength={10}
                error={error}
                containerStyle={styles.mobileInput}
              />
            </View>
          </View>

          {/* Info note */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              📱 A 6-digit OTP will be sent to your mobile number via SMS.
            </Text>
          </View>

          <AuthButton
            label="Send OTP"
            onPress={handleSendOTP}
            loading={isLoading}
            disabled={mobile.length !== 10}
          />
        </View>

        {/* Register redirect */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
            <Text style={styles.registerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Demo hint */}
        <View style={styles.demoBox}>
          <Text style={styles.demoText}>
            🧪 Demo: Enter any 10-digit number → use OTP <Text style={styles.demoOtp}>1 2 3 4 5 6</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // Back
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingLeft: spacing.lg,
    gap: 6,
    marginBottom: spacing.lg,
  },
  backArrow: {
    fontSize: 20,
    color: colors.text,
  },
  backText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },

  // Header
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  logoSmall: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: spacing.md,
  },
  crossV: {
    position: 'absolute',
    width: 6,
    height: 26,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  crossH: {
    position: 'absolute',
    width: 26,
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },

  // Mobile row
  mobileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 10,
    height: 50,
    marginTop: 25, // align with input (label height)
  },
  flag: {
    fontSize: 18,
  },
  countryCode: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  mobileInputWrap: {
    flex: 1,
  },
  mobileInput: {
    marginBottom: 0,
  },

  // Info
  infoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    ...typography.caption,
    color: colors.primary,
    lineHeight: 18,
  },

  // Register redirect
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  registerText: {
    ...typography.body,
    color: colors.subtext,
  },
  registerLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },

  // Demo hint
  demoBox: {
    backgroundColor: colors.warningLight,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  demoText: {
    ...typography.caption,
    color: colors.text,
    lineHeight: 18,
  },
  demoOtp: {
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 4,
  },
});
