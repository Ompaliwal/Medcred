/**
 * QR Code Screen
 * Displays a large QR code for hospital scanning.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function QRCodeScreen() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.qrCard}>
          <Text style={styles.instruction}>
            Show this QR code at the hospital reception for quick cashless processing.
          </Text>
          
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrText}>[ QR CODE FOR {user.id} ]</Text>
            {/* In a real app, use react-native-qrcode-svg here */}
            <View style={styles.qrMockGrid}>
              {Array.from({ length: 16 }).map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.qrMockBlock, 
                    { backgroundColor: Math.random() > 0.5 ? colors.text : colors.white }
                  ]} 
                />
              ))}
            </View>
          </View>

          <Text style={styles.cardName}>{user.fullName}</Text>
          <Text style={styles.cardId}>{user.id}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  backArrow: { fontSize: 20, color: colors.white, marginRight: 4 },
  backText: { ...typography.body, color: colors.white, fontWeight: '500' },
  headerTitle: { ...typography.h3, color: colors.white },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  qrCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  instruction: {
    ...typography.body,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  qrPlaceholder: {
    width: 240,
    height: 240,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    padding: spacing.sm,
  },
  qrText: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 4,
    ...typography.caption,
    fontWeight: '700',
  },
  qrMockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  qrMockBlock: {
    width: '25%',
    height: '25%',
  },
  cardName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 4,
  },
  cardId: {
    ...typography.body,
    color: colors.subtext,
    letterSpacing: 1,
  },
});
