/**
 * Edit Profile Screen
 * Form to update user details and mock photo upload.
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
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function EditProfileScreen() {
  const { user, updateUser, isLoading } = useAuth();

  const [form, setForm] = useState({
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    profilePhoto: user?.profilePhoto || '',
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const setField = (key: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const handlePickPhoto = () => {
    Alert.alert(
      'Profile Photo',
      'Select a photo from your gallery.',
      [
        { text: 'Mock Upload', onPress: () => setField('profilePhoto', 'mock://new-profile-photo') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.address.trim()) e.address = 'Address is required.';
    if (!form.city.trim()) e.city = 'City is required.';
    if (!form.state.trim()) e.state = 'State is required.';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode.';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const result = await updateUser(form);
    if (result.success) {
      Alert.alert('Success', result.message, [{ text: 'OK', onPress: () => router.back() }]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Photo Upload */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            {form.profilePhoto ? (
               <View style={styles.avatarPlaceholderImage}>
                 <Text style={{ fontSize: 40 }}>👤</Text>
               </View>
            ) : (
               <View style={styles.avatarFallback}>
                 <Text style={styles.avatarText}>{user?.fullName?.[0] ?? 'U'}</Text>
               </View>
            )}
          </View>
          <TouchableOpacity style={styles.changePhotoBtn} onPress={handlePickPhoto}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <AuthInput
            label="Email Address"
            required
            value={form.email}
            onChangeText={v => setField('email', v.toLowerCase())}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AuthInput
            label="Full Address"
            required
            value={form.address}
            onChangeText={v => setField('address', v)}
            error={errors.address}
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: 'top', paddingTop: 8 }}
          />
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <AuthInput
                label="City"
                required
                value={form.city}
                onChangeText={v => setField('city', v)}
                error={errors.city}
              />
            </View>
            <View style={styles.halfWidth}>
              <AuthInput
                label="State"
                required
                value={form.state}
                onChangeText={v => setField('state', v)}
                error={errors.state}
              />
            </View>
          </View>
          <AuthInput
            label="Pincode"
            required
            value={form.pincode}
            onChangeText={v => setField('pincode', v.replace(/\D/g, '').slice(0, 6))}
            error={errors.pincode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Note: Mobile number and Aadhaar cannot be changed directly as they are linked to your KYC.</Text>
        </View>

        <AuthButton label="Save Changes" onPress={handleSave} loading={isLoading} />

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.white,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { fontSize: 20, color: colors.subtext, marginRight: 4 },
  backText: { ...typography.body, color: colors.subtext, fontWeight: '500' },
  headerTitle: { ...typography.h3, color: colors.text, marginRight: 30 },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  photoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: { marginBottom: spacing.sm },
  avatarFallback: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 36, fontWeight: '700', color: colors.white },
  avatarPlaceholderImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoBtn: { padding: spacing.xs },
  changePhotoText: { ...typography.body, color: colors.primary, fontWeight: '600' },
  formSection: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },
  infoBox: {
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xl,
  },
  infoText: { ...typography.caption, color: colors.text, lineHeight: 18 },
});
