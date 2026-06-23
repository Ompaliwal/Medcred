/**
 * OTP Verify Screen — 6-box OTP input with 60s countdown resend timer.
 * Handles both 'login' and 'register' flows via route params.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import OTPInput from '@/components/auth/OTPInput';
import AuthButton from '@/components/auth/AuthButton';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

const RESEND_TIMEOUT = 60;

export default function OTPVerifyScreen() {
  const { mobile, flow } = useLocalSearchParams<{ mobile: string; flow: 'login' | 'register' }>();
  const { verifyOTP, login, sendOTP, isLoading } = useAuth();

  const [otp, setOtp]           = useState('');
  const [timer, setTimer]       = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const resetTimer = () => {
    clearInterval(timerRef.current!);
    setTimer(RESEND_TIMEOUT);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!canResend) return;
    const result = await sendOTP(mobile);
    if (result.success) {
      resetTimer();
      setOtp('');
      setOtpError(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setOtpError(true);
      return;
    }

    setOtpError(false);

    let result;
    if (flow === 'login') {
      result = await login(mobile, otp);
    } else {
      result = await verifyOTP(mobile, otp);
    }

    if (result.success) {
      if (flow === 'login') {
        // Navigate to main app tabs
        router.replace('/(tabs)');
      } else {
        // For registration flow, OTP was just to verify mobile — continue registering
        router.back();
      }
    } else {
      setOtpError(true);
      Alert.alert('Invalid OTP', result.message);
    }
  };

  const maskedMobile = mobile
    ? `+91 ${mobile.slice(0, 2)}XXXXXX${mobile.slice(8)}`
    : '+91 XXXXXXXXXX';

  const formatTimer = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* OTP Icon */}
        <View style={styles.iconWrap}>
          <Text style={styles.iconEmoji}>🔐</Text>
        </View>

        {/* Header */}
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          A 6-digit code was sent to{'\n'}
          <Text style={styles.mobileHighlight}>{maskedMobile}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpSection}>
          <OTPInput value={otp} onChange={v => { setOtp(v); setOtpError(false); }} hasError={otpError} />
          {otpError && (
            <Text style={styles.errorText}>The OTP you entered is incorrect. Please try again.</Text>
          )}
        </View>

        {/* Timer / Resend */}
        <View style={styles.timerRow}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendActive}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend OTP in{' '}
              <Text style={styles.timerCountdown}>{formatTimer(timer)}</Text>
            </Text>
          )}
        </View>

        {/* Verify button */}
        <View style={styles.btnWrap}>
          <AuthButton
            label={flow === 'login' ? 'Login' : 'Verify & Continue'}
            onPress={handleVerify}
            loading={isLoading}
            disabled={otp.length !== 6}
          />
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📌 Note</Text>
          <Text style={styles.infoText}>
            {`• OTP is valid for 10 minutes\n• Do not share your OTP with anyone\n• MedCred will never ask for your OTP`}
          </Text>
        </View>

        {/* Demo hint */}
        <View style={styles.demoBox}>
          <Text style={styles.demoText}>
            🧪 Demo mode: use OTP <Text style={styles.demoOtp}>1 2 3 4 5 6</Text>
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
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },

  // Back
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    gap: 6,
    marginBottom: spacing.xl,
    alignSelf: 'flex-start',
  },
  backArrow: { fontSize: 20, color: colors.text },
  backText: { ...typography.body, color: colors.text, fontWeight: '500' },

  // Icon
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  iconEmoji: { fontSize: 36 },

  // Header
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  mobileHighlight: {
    color: colors.primary,
    fontWeight: '700',
  },

  // OTP
  otpSection: {
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  // Timer
  timerRow: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  timerText: {
    ...typography.body,
    color: colors.subtext,
  },
  timerCountdown: {
    color: colors.primary,
    fontWeight: '700',
  },
  resendActive: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Button
  btnWrap: {
    marginBottom: spacing.xl,
  },

  // Info card
  infoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  infoTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.caption,
    color: colors.text,
    lineHeight: 20,
  },

  // Demo
  demoBox: {
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  demoText: {
    ...typography.caption,
    color: colors.text,
  },
  demoOtp: {
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 4,
  },
});
