/**
 * Register Screen — 3-step registration form.
 *   Step 1: Personal Info (Name, Mobile, Email, DOB, Gender)
 *   Step 2: Address (Address, City, State, Pincode)
 *   Step 3: Identity (Aadhaar, Profile Photo)
 *
 * All frontend only — no backend calls.
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
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth, RegisterFormData } from '@/context/AuthContext';
import AuthButton from '@/components/auth/AuthButton';
import AuthInput from '@/components/auth/AuthInput';
import StepIndicator from '@/components/auth/StepIndicator';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

const STEP_LABELS = ['Personal', 'Address', 'Identity'];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

const EMPTY_FORM: RegisterFormData = {
  fullName: '', mobile: '', email: '', dateOfBirth: '', gender: '',
  address: '', city: '', state: '', pincode: '',
  aadhaarNumber: '', profilePhoto: undefined,
};

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState<RegisterFormData>(EMPTY_FORM);
  const [errors, setErrors]       = useState<FormErrors>({});
  const [showStateList, setShowStateList] = useState(false);
  const [showGenderList, setShowGenderList] = useState(false);

  const setField = (key: keyof RegisterFormData, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  // ─── Validation per step ─────────────────────────────────────────────────

  const validateStep1 = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim())  e.fullName = 'Full name is required.';
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required (YYYY-MM-DD).';
    if (!form.gender)      e.gender = 'Please select a gender.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: FormErrors = {};
    if (!form.address.trim()) e.address = 'Address is required.';
    if (!form.city.trim())    e.city    = 'City is required.';
    if (!form.state)          e.state   = 'Please select a state.';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = (): boolean => {
    const e: FormErrors = {};
    const aadhaar = form.aadhaarNumber.replace(/\s|-/g, '');
    if (!/^\d{12}$/.test(aadhaar)) e.aadhaarNumber = 'Enter a valid 12-digit Aadhaar number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Navigation ───────────────────────────────────────────────────────────

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) setStep(s => s + 1);
  };

  const goBack = () => {
    if (step > 1) { setStep(s => s - 1); return; }
    router.back();
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    // Route to Aadhaar verification with serialized form data
    router.push({
      pathname: '/(auth)/aadhaar-verify',
      params: { formData: JSON.stringify(form) },
    });
  };

  // ─── Mock photo picker ────────────────────────────────────────────────────

  const handlePickPhoto = () => {
    // Future: use expo-image-picker → upload to S3 pre-signed URL
    Alert.alert(
      'Profile Photo',
      'Photo upload will be enabled once the backend is connected.\n\nFor now, a placeholder is used.',
      [
        { text: 'OK', onPress: () => setField('profilePhoto', 'mock://profile-photo') },
      ],
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

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
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>{step > 1 ? 'Previous' : 'Back'}</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Step {step} of 3 — {STEP_LABELS[step - 1]}</Text>
        </View>

        {/* Step indicator */}
        <StepIndicator currentStep={step} totalSteps={3} labels={STEP_LABELS} />

        {/* Form card */}
        <View style={styles.card}>
          {step === 1 && <Step1 form={form} errors={errors} setField={setField} showGenderList={showGenderList} setShowGenderList={setShowGenderList} />}
          {step === 2 && <Step2 form={form} errors={errors} setField={setField} showStateList={showStateList} setShowStateList={setShowStateList} />}
          {step === 3 && <Step3 form={form} errors={errors} setField={setField} onPickPhoto={handlePickPhoto} />}

          {/* Action button */}
          {step < 3 ? (
            <AuthButton label="Continue →" onPress={goNext} />
          ) : (
            <AuthButton label="Verify Aadhaar" onPress={handleSubmit} />
          )}
        </View>

        {/* Login redirect */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already registered? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 1: Personal Info ────────────────────────────────────────────────────

function Step1({ form, errors, setField, showGenderList, setShowGenderList }: any) {
  return (
    <>
      <Text style={styles.stepTitle}>Personal Information</Text>

      <AuthInput
        label="Full Name"
        required
        placeholder="As per Aadhaar card"
        value={form.fullName}
        onChangeText={v => setField('fullName', v)}
        error={errors.fullName}
        autoCapitalize="words"
      />

      <AuthInput
        label="Mobile Number"
        required
        placeholder="10-digit mobile"
        value={form.mobile}
        onChangeText={v => setField('mobile', v.replace(/\D/g, '').slice(0, 10))}
        error={errors.mobile}
        keyboardType="number-pad"
        maxLength={10}
        hint="OTP verification will be done on this number"
      />

      <AuthInput
        label="Email Address"
        required
        placeholder="your@email.com"
        value={form.email}
        onChangeText={v => setField('email', v.toLowerCase())}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <AuthInput
        label="Date of Birth"
        required
        placeholder="YYYY-MM-DD"
        value={form.dateOfBirth}
        onChangeText={v => setField('dateOfBirth', v)}
        error={errors.dateOfBirth}
        hint="Format: YYYY-MM-DD (e.g. 1990-05-15)"
        keyboardType="number-pad"
      />

      {/* Gender picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Gender <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity
          style={[styles.pickerBtn, errors.gender && styles.pickerBtnError]}
          onPress={() => setShowGenderList((p: boolean) => !p)}
        >
          <Text style={form.gender ? styles.pickerSelected : styles.pickerPlaceholder}>
            {form.gender || 'Select gender'}
          </Text>
          <Text style={styles.pickerChevron}>{showGenderList ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {errors.gender && <Text style={styles.pickerError}>{errors.gender}</Text>}
        {showGenderList && (
          <View style={styles.pickerList}>
            {GENDERS.map(g => (
              <TouchableOpacity
                key={g}
                style={styles.pickerItem}
                onPress={() => { setField('gender', g); setShowGenderList(false); }}
              >
                <Text style={[styles.pickerItemText, form.gender === g && styles.pickerItemActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </>
  );
}

// ─── Step 2: Address ──────────────────────────────────────────────────────────

function Step2({ form, errors, setField, showStateList, setShowStateList }: any) {
  return (
    <>
      <Text style={styles.stepTitle}>Address Details</Text>

      <AuthInput
        label="Full Address"
        required
        placeholder="House no., Street, Area"
        value={form.address}
        onChangeText={v => setField('address', v)}
        error={errors.address}
        multiline
        numberOfLines={3}
        style={{ height: 80, textAlignVertical: 'top', paddingTop: 8 }}
        autoCapitalize="words"
      />

      <AuthInput
        label="City"
        required
        placeholder="Your city"
        value={form.city}
        onChangeText={v => setField('city', v)}
        error={errors.city}
        autoCapitalize="words"
      />

      {/* State picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>State <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity
          style={[styles.pickerBtn, errors.state && styles.pickerBtnError]}
          onPress={() => setShowStateList((p: boolean) => !p)}
        >
          <Text style={form.state ? styles.pickerSelected : styles.pickerPlaceholder}>
            {form.state || 'Select state'}
          </Text>
          <Text style={styles.pickerChevron}>{showStateList ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {errors.state && <Text style={styles.pickerError}>{errors.state}</Text>}
        {showStateList && (
          <ScrollView style={styles.stateList} nestedScrollEnabled>
            {INDIAN_STATES.map(s => (
              <TouchableOpacity
                key={s}
                style={styles.pickerItem}
                onPress={() => { setField('state', s); setShowStateList(false); }}
              >
                <Text style={[styles.pickerItemText, form.state === s && styles.pickerItemActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <AuthInput
        label="Pincode"
        required
        placeholder="6-digit pincode"
        value={form.pincode}
        onChangeText={v => setField('pincode', v.replace(/\D/g, '').slice(0, 6))}
        error={errors.pincode}
        keyboardType="number-pad"
        maxLength={6}
      />
    </>
  );
}

// ─── Step 3: Identity ─────────────────────────────────────────────────────────

function Step3({ form, errors, setField, onPickPhoto }: any) {
  return (
    <>
      <Text style={styles.stepTitle}>Identity Verification</Text>

      {/* Aadhaar */}
      <AuthInput
        label="Aadhaar Number"
        required
        placeholder="1234 5678 9012"
        value={form.aadhaarNumber}
        onChangeText={v => {
          // Auto-format: XXXX XXXX XXXX
          const digits = v.replace(/\D/g, '').slice(0, 12);
          const formatted = digits.replace(/(.{4})(.{4})?(.{4})?/, (_, a, b, c) =>
            [a, b, c].filter(Boolean).join(' ')
          );
          setField('aadhaarNumber', formatted);
        }}
        error={errors.aadhaarNumber}
        keyboardType="number-pad"
        maxLength={14}
        hint="Your 12-digit Aadhaar number for KYC verification"
      />

      {/* Security note */}
      <View style={styles.securityNote}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Your Aadhaar information is encrypted and stored securely. Used only for KYC verification as per UIDAI guidelines.
        </Text>
      </View>

      {/* Profile Photo */}
      <Text style={styles.pickerLabel}>
        Profile Photo <Text style={styles.optional}>(Optional)</Text>
      </Text>
      <TouchableOpacity style={styles.photoPickerBtn} onPress={onPickPhoto}>
        {form.profilePhoto ? (
          <View style={styles.photoSelected}>
            <Text style={styles.photoSelectedIcon}>✅</Text>
            <Text style={styles.photoSelectedText}>Photo selected</Text>
            <TouchableOpacity onPress={() => setField('profilePhoto', undefined)}>
              <Text style={styles.photoRemove}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoEmpty}>
            <Text style={styles.photoEmptyIcon}>📷</Text>
            <Text style={styles.photoEmptyTitle}>Upload Profile Photo</Text>
            <Text style={styles.photoEmptySubtext}>Tap to select from gallery or camera</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* KYC info */}
      <View style={styles.kycInfo}>
        <Text style={styles.kycInfoTitle}>📋 What happens after registration?</Text>
        <View style={styles.kycSteps}>
          {[
            { icon: '📱', text: 'Mobile OTP verified' },
            { icon: '🔍', text: 'KYC review by our team (24–48 hrs)' },
            { icon: '✅', text: 'Card activated upon approval' },
          ].map((item, i) => (
            <View key={i} style={styles.kycStep}>
              <Text style={styles.kycStepIcon}>{item.icon}</Text>
              <Text style={styles.kycStepText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingBottom: 48 },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingLeft: spacing.lg,
    gap: 6,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backArrow: { fontSize: 20, color: colors.text },
  backText: { ...typography.body, color: colors.text, fontWeight: '500' },

  headerWrap: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: { ...typography.h1, marginBottom: 4 },
  subtitle: { ...typography.body, color: colors.subtext },

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
  stepTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // Picker
  pickerContainer: { marginBottom: spacing.md },
  pickerLabel: { ...typography.caption, fontSize: 13, fontWeight: '500', color: colors.text, marginBottom: 6 },
  required: { color: colors.danger },
  optional: { color: colors.subtext, fontWeight: '400' },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    height: 50,
    paddingHorizontal: spacing.md,
  },
  pickerBtnError: { borderColor: colors.danger, backgroundColor: colors.dangerLight },
  pickerSelected: { ...typography.body, color: colors.text },
  pickerPlaceholder: { ...typography.body, color: colors.subtext },
  pickerChevron: { fontSize: 12, color: colors.subtext },
  pickerError: { ...typography.caption, color: colors.danger, marginTop: 4 },
  pickerList: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  stateList: { maxHeight: 200, ...StyleSheet.flatten({}) as any },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerItemText: { ...typography.body, color: colors.text },
  pickerItemActive: { color: colors.primary, fontWeight: '700' },

  // Security / KYC notes
  securityNote: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.secondaryLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  securityIcon: { fontSize: 16, marginTop: 1 },
  securityText: { ...typography.caption, color: colors.text, flex: 1, lineHeight: 18 },

  // Photo picker
  photoPickerBtn: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  photoEmpty: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: 8,
  },
  photoEmptyIcon: { fontSize: 36 },
  photoEmptyTitle: { ...typography.body, fontWeight: '600', color: colors.text },
  photoEmptySubtext: { ...typography.caption },
  photoSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.secondaryLight,
    gap: 8,
  },
  photoSelectedIcon: { fontSize: 20 },
  photoSelectedText: { ...typography.body, color: colors.secondary, flex: 1 },
  photoRemove: { ...typography.caption, color: colors.danger, fontWeight: '600' },

  // KYC steps
  kycInfo: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  kycInfoTitle: { ...typography.body, fontWeight: '700', color: colors.primary, marginBottom: spacing.md },
  kycSteps: { gap: spacing.sm },
  kycStep: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  kycStepIcon: { fontSize: 16, width: 24 },
  kycStepText: { ...typography.body, color: colors.text, flex: 1 },

  // Login redirect
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: { ...typography.body, color: colors.subtext },
  loginLink: { ...typography.body, color: colors.primary, fontWeight: '600' },
});
