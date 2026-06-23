/**
 * Family Member Aadhaar Verification Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import OTPInput from '@/components/auth/OTPInput';
import AuthButton from '@/components/auth/AuthButton';
import { colors, typography, spacing } from '@/constants/theme';

export default function FamilyVerifyScreen() {
  const { id } = useLocalSearchParams();
  const { verifyFamilyMember, isLoading } = useAuth();
  
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    if (typeof id !== 'string') return;

    const result = await verifyFamilyMember(id, otp);
    if (result.success) {
      Alert.alert('Success', 'Family member verified successfully!', [
        { text: 'OK', onPress: () => router.replace('/family') }
      ]);
    } else {
      Alert.alert('Verification Failed', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Member</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="finger-print" size={64} color={colors.primary} />
        </View>
        
        <Text style={styles.title}>Aadhaar Verification</Text>
        <Text style={styles.subtitle}>
          An OTP has been sent to the Aadhaar registered mobile number of the family member.
        </Text>

        <OTPInput value={otp} onChange={setOtp} />

        <AuthButton
          label="Verify Aadhaar"
          onPress={handleVerify}
          loading={isLoading}
          style={{ marginTop: spacing.xl }}
        />
        
        <TouchableOpacity style={styles.resendBtn}>
          <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendBold}>Resend</Text></Text>
        </TouchableOpacity>
      </View>
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
    width: 60,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    paddingTop: 60,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  resendBtn: {
    marginTop: spacing.xl,
    padding: spacing.sm,
  },
  resendText: {
    ...typography.body,
    color: colors.subtext,
  },
  resendBold: {
    color: colors.primary,
    fontWeight: '700',
  },
});
