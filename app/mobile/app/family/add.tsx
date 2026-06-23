/**
 * Add Family Member Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, FamilyMember } from '@/context/AuthContext';
import AuthButton from '@/components/auth/AuthButton';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function AddFamilyMemberScreen() {
  const { addFamilyMember, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    relationship: 'Spouse' as FamilyMember['relationship'],
    aadhaarNumber: '',
    dateOfBirth: '',
    gender: 'Female' as FamilyMember['gender'],
  });

  const handleAdd = async () => {
    if (!formData.fullName || !formData.aadhaarNumber || !formData.dateOfBirth) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    if (formData.aadhaarNumber.length < 12) {
      Alert.alert('Error', 'Aadhaar must be 12 digits');
      return;
    }

    const newId = await addFamilyMember(formData);
    
    // After adding, prompt to verify now or later
    Alert.alert(
      'Member Added',
      'Family member added successfully. Would you like to verify their Aadhaar now?',
      [
        { text: 'Later', onPress: () => router.back(), style: 'cancel' },
        { text: 'Verify Now', onPress: () => router.replace({ pathname: '/family/verify', params: { id: newId } }) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Family Member</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Member Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="As per Aadhaar"
            value={formData.fullName}
            onChangeText={(t) => setFormData({ ...formData, fullName: t })}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
            <Text style={styles.label}>Relationship</Text>
            {/* Mock dropdown using simple buttons for now */}
            <TouchableOpacity 
              style={styles.input}
              onPress={() => {
                const options: FamilyMember['relationship'][] = ['Spouse', 'Child', 'Parent', 'Other'];
                const next = options[(options.indexOf(formData.relationship) + 1) % options.length];
                setFormData({ ...formData, relationship: next });
              }}
            >
              <Text>{formData.relationship}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.sm }]}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => {
                const options: FamilyMember['gender'][] = ['Male', 'Female', 'Other'];
                const next = options[(options.indexOf(formData.gender) + 1) % options.length];
                setFormData({ ...formData, gender: next });
              }}
            >
              <Text>{formData.gender}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.dateOfBirth}
            onChangeText={(t) => setFormData({ ...formData, dateOfBirth: t })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Aadhaar Number</Text>
          <TextInput
            style={styles.input}
            placeholder="12-digit Aadhaar"
            keyboardType="number-pad"
            maxLength={12}
            value={formData.aadhaarNumber}
            onChangeText={(t) => setFormData({ ...formData, aadhaarNumber: t })}
          />
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Adding a family member will share your health plan benefits with them. They must complete Aadhaar verification to be active.
          </Text>
        </View>

        <AuthButton
          label="Save Member"
          onPress={handleAdd}
          loading={isLoading}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
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
  scroll: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    ...typography.body,
    justifyContent: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: 8,
  },
  infoText: {
    flex: 1,
    ...typography.caption,
    color: colors.primaryDark,
    lineHeight: 18,
  },
});
