/**
 * Aadhaar Verification Screen
 * Receives the partially completed registration form.
 * Mocks an OTP sent to the user's Aadhaar-linked mobile number.
 * Upon successful verification, calls the register function.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth, RegisterFormData } from '@/context/AuthContext';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function AadhaarVerifyScreen() {
  const { verifyOTP, register, isLoading } = useAuth();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  // Parse the serialized form data
  const formData: RegisterFormData = params.formData
    ? JSON.parse(params.formData as string)
    : null;

  useEffect(() => {
    if (!formData) {
      Alert.alert('Error', 'Missing registration data.');
      router.back();
    }
  }, [formData]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    if (!formData) return;

    // First verify the OTP (Mocked, accepts any 6-digit number)
    const verifyResult = await verifyOTP(formData.mobile, otp);
    if (!verifyResult.success) {
      Alert.alert('Verification Failed', verifyResult.message);
      return;
    }

    // Then register the user
    const registerResult = await register(formData);
    if (registerResult.success) {
      router.replace('/(auth)/kyc-pending');
    } else {
      Alert.alert('Registration Failed', registerResult.message);
    }
  };

  const handleResend = () => {
    setTimer(30);
    // Real API call to resend OTP would go here
    Alert.alert('OTP Sent', 'A new OTP has been sent to your Aadhaar linked mobile number.');
  };

  if (!formData) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Aadhaar Verification</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to your Aadhaar linked mobile number ending in {formData.mobile.slice(-4)}.
        </Text>

        <AuthInput
          label="Verification Code"
          placeholder="000000"
          value={otp}
          onChangeText={v => setOtp(v.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.otpInput}
        />

        <AuthButton 
          label="Verify OTP" 
          onPress={handleVerify} 
          loading={isLoading} 
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
            <Text style={[styles.resendLink, timer > 0 && styles.resendLinkDisabled]}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: colors.primary,
    marginRight: 4,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.subtext,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 4,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  resendText: {
    ...typography.body,
    color: colors.subtext,
  },
  resendLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: colors.border,
  },
});
