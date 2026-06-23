import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

export interface Hospital {
  id: string;
  name: string;
  location: string;
  city: string;
  distance: string;
  rating: number;
  isPartner: boolean;
  specialties: string[];
  helpline: string;
  address: string;
}

export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: '1',
    name: 'Max Super Speciality Hospital',
    location: 'Saket, New Delhi',
    city: 'New Delhi',
    distance: '1.8 km',
    rating: 4.8,
    isPartner: true,
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
    helpline: '+91 11 2651 5050',
    address: '1 & 2, Press Enclave Road, Saket Institutional Area, Saket, New Delhi, Delhi 110017',
  },
  {
    id: '2',
    name: 'Fortis Memorial Research Institute',
    location: 'Sector 44, Gurugram',
    city: 'Gurugram',
    distance: '3.5 km',
    rating: 4.7,
    isPartner: true,
    specialties: ['Cardiology', 'Pediatrics', 'Gastroenterology', 'Neurology'],
    helpline: '+91 124 4962 200',
    address: 'Sector - 44, Opposite HUDA City Centre, Gurugram, Haryana 122002',
  },
  {
    id: '3',
    name: 'Sir Ganga Ram Hospital',
    location: 'Rajinder Nagar, New Delhi',
    city: 'New Delhi',
    distance: '5.2 km',
    rating: 4.5,
    isPartner: false,
    specialties: ['General Medicine', 'Nephrology', 'Urology', 'Pediatrics'],
    helpline: '+91 11 2575 7575',
    address: 'Sir Ganga Ram Hospital Marg, Rajinder Nagar, New Delhi, Delhi 110060',
  },
  {
    id: '4',
    name: 'Medanta - The Medicity',
    location: 'Sector 38, Gurugram',
    city: 'Gurugram',
    distance: '6.1 km',
    rating: 4.9,
    isPartner: true,
    specialties: ['Cardiology', 'Liver Transplant', 'Oncology', 'Orthopedics'],
    helpline: '+91 124 4141 414',
    address: 'CH Baktawar Singh Road, Sector 38, Gurugram, Haryana 122001',
  },
  {
    id: '5',
    name: 'Indraprastha Apollo Hospitals',
    location: 'Sarita Vihar, New Delhi',
    city: 'New Delhi',
    distance: '8.4 km',
    rating: 4.6,
    isPartner: true,
    specialties: ['Cardiology', 'Nephrology', 'Organ Transplant', 'Pediatrics'],
    helpline: '+91 11 2692 5858',
    address: 'Delhi-Mathura Road, Sarita Vihar, New Delhi, Delhi 110076',
  },
  {
    id: '6',
    name: 'Tata Memorial Hospital',
    location: 'Parel, Mumbai',
    city: 'Mumbai',
    distance: '12.0 km',
    rating: 4.8,
    isPartner: false,
    specialties: ['Oncology', 'Radiology', 'Pathology'],
    helpline: '+91 22 2417 7000',
    address: 'Dr. Ernest Borges Road, Parel, Mumbai, Maharashtra 400012',
  },
  {
    id: '7',
    name: 'Manipal Hospital',
    location: 'HAL Old Airport Road, Bengaluru',
    city: 'Bengaluru',
    distance: '2.3 km',
    rating: 4.7,
    isPartner: true,
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Gastroenterology'],
    helpline: '+91 80 2502 4444',
    address: '98, HAL Old Airport Road, Kodihalli, Bengaluru, Karnataka 560017',
  },
];

export default function HospitalListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPartnersOnly, setShowPartnersOnly] = useState(false);

  const filteredHospitals = MOCK_HOSPITALS.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      hospital.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showPartnersOnly) {
      return matchesSearch && hospital.isPartner;
    }
    return matchesSearch;
  });

  const renderHospitalCard = ({ item }: { item: Hospital }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/hospitals/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hospitalName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.hospitalLocation}>
            <Ionicons name="location-outline" size={14} color={colors.subtext} /> {item.location}
          </Text>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#FBBC04" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.specialtiesContainer}>
        {item.specialties.slice(0, 3).map((spec, index) => (
          <View key={index} style={styles.specialtyChip}>
            <Text style={styles.specialtyText}>{spec}</Text>
          </View>
        ))}
        {item.specialties.length > 3 && (
          <View style={styles.specialtyChip}>
            <Text style={styles.specialtyText}>+{item.specialties.length - 3} more</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.distanceText}>
          <Ionicons name="navigate-outline" size={14} color={colors.primary} /> {item.distance}
        </Text>

        {item.isPartner ? (
          <View style={styles.partnerBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.secondary} />
            <Text style={styles.partnerBadgeText}>Partner Network</Text>
          </View>
        ) : (
          <View style={[styles.partnerBadge, { backgroundColor: colors.border }]}>
            <Text style={[styles.partnerBadgeText, { color: colors.subtext }]}>Non-Partner</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hospitals</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search and Filters */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.subtext} style={styles.searchIcon} />
          <TextInput
            placeholder="Search by name, specialty, location..."
            placeholderTextColor={colors.subtext}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.subtext} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters Row */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, !showPartnersOnly && styles.filterChipActive]}
            onPress={() => setShowPartnersOnly(false)}
          >
            <Text style={[styles.filterChipText, !showPartnersOnly && styles.filterChipTextActive]}>
              All Hospitals
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, showPartnersOnly && styles.filterChipActive]}
            onPress={() => setShowPartnersOnly(true)}
          >
            <Ionicons
              name="shield-checkmark"
              size={14}
              color={showPartnersOnly ? colors.white : colors.primary}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.filterChipText, showPartnersOnly && styles.filterChipTextActive]}>
              Partner Network
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredHospitals}
        renderItem={renderHospitalCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={colors.disabledText} />
            <Text style={styles.emptyTitle}>No Hospitals Found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with another term or toggle the Partner Network filter.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  searchWrapper: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  hospitalLocation: {
    fontSize: 13,
    color: colors.subtext,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  specialtyChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  specialtyText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  partnerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
