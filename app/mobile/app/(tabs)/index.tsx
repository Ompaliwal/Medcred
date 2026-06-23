/**
 * Dashboard Screen — MedCred India
 * Rich homepage with carousel, quick actions, coverage card,
 * recent activity, featured hospitals, and collapsible FAQ.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/constants/theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const { width } = Dimensions.get('window');
const CARD_W = (width - spacing.md * 2 - 12 * 2) / 3;
const BANNER_W = width - spacing.md * 2;

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROMO_SLIDES = [
  { id: '1', icon: 'card-outline'              as const, title: 'Cashless Healthcare',      body: 'Use your MedCred card at 500+ partner hospitals for zero upfront payments.',          color: '#1A73E8' },
  { id: '2', icon: 'shield-checkmark-outline'  as const, title: '₹5 Lakh Coverage',         body: 'Annual health coverage for self and up to 4 family members — fully digital.',          color: '#059669' },
  { id: '3', icon: 'cash-outline'              as const, title: '0% Medical Loans',          body: 'Get instant pre-approved medical loans at zero interest for active cardholders.',      color: '#7C3AED' },
  { id: '4', icon: 'people-outline'            as const, title: 'Family Protection',         body: 'Add spouse, children and parents under one single MedCred card.',                     color: '#DC2626' },
];

const MODULES = [
  { icon: 'card',          label: 'Health Card', color: '#1A73E8', bg: '#EEF4FF', route: '/card'      },
  { icon: 'people',        label: 'Family',      color: '#059669', bg: '#ECFDF5', route: '/family'    },
  { icon: 'document-text', label: 'Claims',      color: '#DC2626', bg: '#FEF2F2', route: '/claims'    },
  { icon: 'business',      label: 'Hospitals',   color: '#7C3AED', bg: '#F5F3FF', route: '/hospitals' },
  { icon: 'cash',          label: 'Loan',        color: '#B45309', bg: '#FFFBEB', route: '/loan'      },
  { icon: 'wallet',        label: 'Wallet',      color: '#0891B2', bg: '#ECFEFF', route: '/wallet'    },
  { icon: 'headset',       label: 'Support',     color: '#059669', bg: '#ECFDF5', route: '/support'   },
];

const QUICK_ACTIONS = [
  { icon: 'add-circle',        label: 'File Claim',      color: '#DC2626', bg: '#FEF2F2', route: '/claims/create' },
  { icon: 'location',          label: 'Find Hospital',   color: '#7C3AED', bg: '#F5F3FF', route: '/hospitals'     },
  { icon: 'people',            label: 'Add Member',      color: '#059669', bg: '#ECFDF5', route: '/family'        },
  { icon: 'cash',              label: 'Get Loan',        color: '#B45309', bg: '#FFFBEB', route: '/loan'          },
  { icon: 'qr-code',           label: 'Show QR',         color: '#1A73E8', bg: '#EEF4FF', route: '/card'          },
  { icon: 'chatbubble-ellipses', label: 'Support',       color: '#0891B2', bg: '#ECFEFF', route: '/support'       },
];

const FEATURED_HOSPITALS = [
  { id: '5', name: 'Indraprastha Apollo',      city: 'New Delhi',  type: 'Multi-specialty', color: '#1A73E8' },
  { id: '2', name: 'Fortis Memorial Research', city: 'Gurugram',   type: 'Super-specialty', color: '#059669' },
  { id: '7', name: 'Manipal Hospital',         city: 'Bengaluru',  type: 'Multi-specialty', color: '#7C3AED' },
  { id: '1', name: 'Max Super Speciality',     city: 'New Delhi',  type: 'Cardiac care',    color: '#DC2626' },
];

const WHY_ITEMS = [
  { icon: 'flash',               color: '#F59E0B', bg: '#FFFBEB', title: 'Instant Cashless Claims',  desc: 'No more reimbursement waiting. Direct settlement with 500+ hospitals.' },
  { icon: 'lock-closed',         color: '#1A73E8', bg: '#EEF4FF', title: 'Fully Digital & Secure',   desc: 'KYC verified identity, encrypted card data, and secure QR-based access.' },
  { icon: 'people',              color: '#059669', bg: '#ECFDF5', title: 'Covers Entire Family',     desc: 'Protect your spouse, children and parents under one single card.' },
  { icon: 'chatbubble-ellipses', color: '#7C3AED', bg: '#F5F3FF', title: '24×7 Claims Support',     desc: 'Our dedicated claims assistance team is available around the clock.' },
  { icon: 'bar-chart',           color: '#0891B2', bg: '#ECFEFF', title: 'Track Everything',         desc: 'Monitor claims, wallet, and loan status in real-time from your dashboard.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const { user, activateCard } = useAuth();
  const [activeSlide, setActiveSlide]   = useState(0);
  const [whyOpen, setWhyOpen]           = useState(false);
  const [openWhyIdx, setOpenWhyIdx]     = useState<number | null>(null);

  const unreadCount = user?.unreadNotifications ?? 0;
  const coverageHospitalUsed  = 45000;
  const coverageHospitalLimit = 200000;
  const coverageHomeUsed      = 12000;
  const coverageHomeLimit     = 80000;
  const coverageTotalUsed     = coverageHospitalUsed + coverageHomeUsed;
  const coverageTotalLimit    = coverageHospitalLimit + coverageHomeLimit; // ₹2,80,000 per FRD
  const coveragePct           = coverageTotalUsed / coverageTotalLimit;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / (BANNER_W + spacing.sm)));
  };

  const toggleWhyItem = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenWhyIdx(openWhyIdx === idx ? null : idx);
  };

  const toggleWhySection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setWhyOpen(!whyOpen);
    setOpenWhyIdx(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ═══════════════════════ HEADER ════════════════════════ */}
      <View style={styles.header}>
        <View style={styles.hBg1} /><View style={styles.hBg2} />

        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.userName} numberOfLines={1}>{user?.fullName ?? 'MedCred User'}</Text>
          </View>
          <TouchableOpacity style={styles.hIconBtn} onPress={() => router.push('/notifications' as any)}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
            {unreadCount > 0 && <View style={styles.notifDot}><Text style={styles.notifDotText}>{unreadCount}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.avatarText}>{user?.fullName?.[0]?.toUpperCase() ?? 'M'}</Text>
          </TouchableOpacity>
        </View>

        {user?.cardStatus === 'ACTIVE' ? (
          <TouchableOpacity style={styles.hBanner} onPress={() => router.push('/card')}>
            <View style={[styles.hBannerIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}><Ionicons name="card" size={18} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hBannerTitle}>Health Card Active</Text>
              <Text style={styles.hBannerSub}>Tap to view &amp; use your card</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        ) : (
          <View style={styles.hBanner}>
            <View style={[styles.hBannerIcon, { backgroundColor: 'rgba(251,188,4,0.25)' }]}><Ionicons name="time" size={18} color={colors.warning} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hBannerTitle}>KYC Under Review</Text>
              <Text style={styles.hBannerSub}>Card activation within 24–48 hrs</Text>
            </View>
            <TouchableOpacity style={styles.simBtn} onPress={() => activateCard()}>
              <Text style={styles.simBtnText}>Simulate</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ═══════════════════ QUICK STATS ═══════════════════════ */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statCard} onPress={() => router.push('/wallet')}>
          <View style={[styles.statIcon, { backgroundColor: '#ECFEFF' }]}><Ionicons name="wallet" size={22} color="#0891B2" /></View>
          <Text style={styles.statVal}>₹{(user?.walletBalance ?? 0).toLocaleString()}</Text>
          <Text style={styles.statLabel}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => router.push('/claims')}>
          <View style={[styles.statIcon, { backgroundColor: '#FEF2F2' }]}><Ionicons name="document-text" size={22} color="#DC2626" /></View>
          <Text style={styles.statVal}>{user?.activeClaims ?? 0}</Text>
          <Text style={styles.statLabel}>Claims</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => router.push('/family')}>
          <View style={[styles.statIcon, { backgroundColor: '#ECFDF5' }]}><Ionicons name="people" size={22} color="#059669" /></View>
          <Text style={styles.statVal}>{user?.familyMembers?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Family</Text>
        </TouchableOpacity>
      </View>

      {/* ═══════════════════ COVERAGE CARD ═════════════════════ */}
      <View style={styles.section}>
        <View style={styles.coverageCard}>

          {/* ── Dark header band ── */}
          <View style={styles.coverageHeader}>
            <View style={styles.covHdrBg} />
            <View style={styles.covHdrRow}>
              <View>
                <Text style={styles.covHdrLabel}>Annual Coverage Limit</Text>
                <Text style={styles.covHdrAmount}>₹2,80,000</Text>
              </View>
              <View style={styles.covHdrBadge}>
                <Ionicons name="shield-checkmark" size={13} color="#fff" />
                <Text style={styles.covHdrBadgeText}>Active</Text>
              </View>
            </View>
            <Text style={styles.covHdrSub}>Per MedCred India FRD · Hospital ₹2L · Home ₹80K</Text>
          </View>

          {/* ── Totals ── */}
          <View style={styles.covBody}>
            <View style={styles.covTotalsRow}>
              <View style={styles.covTotalItem}>
                <Text style={styles.covTotalVal}>₹{coverageTotalUsed.toLocaleString()}</Text>
                <Text style={styles.covTotalLabel}>Used</Text>
              </View>
              <View style={styles.covDivider} />
              <View style={styles.covTotalItem}>
                <Text style={[styles.covTotalVal, { color: '#059669' }]}>₹{(coverageTotalLimit - coverageTotalUsed).toLocaleString()}</Text>
                <Text style={styles.covTotalLabel}>Remaining</Text>
              </View>
              <View style={styles.covDivider} />
              <View style={styles.covTotalItem}>
                <Text style={[styles.covTotalVal, { color: '#6B7280' }]}>{Math.round(coveragePct * 100)}%</Text>
                <Text style={styles.covTotalLabel}>Utilised</Text>
              </View>
            </View>

            {/* ── Master progress bar ── */}
            <View style={styles.covMasterBar}>
              <View style={[styles.covMasterFill, { width: `${Math.round(coveragePct * 100)}%` as any }]} />
            </View>

            {/* ── Breakdown tiles ── */}
            <View style={styles.covTiles}>
              {/* Hospital tile */}
              <View style={styles.covTile}>
                <View style={styles.covTileTop}>
                  <View style={[styles.covTileIcon, { backgroundColor: '#EEF4FF' }]}>
                    <Ionicons name="business" size={15} color="#1A73E8" />
                  </View>
                  <Text style={styles.covTileTitle}>Hospital</Text>
                  <Text style={styles.covTileLimit}>Max ₹2L</Text>
                </View>
                <View style={[styles.covTileBar, { backgroundColor: '#EEF4FF' }]}>
                  <View style={[styles.covTileBarFill, { width: `${Math.round((coverageHospitalUsed / coverageHospitalLimit) * 100)}%` as any, backgroundColor: '#1A73E8' }]} />
                </View>
                <View style={styles.covTileFooter}>
                  <Text style={styles.covTileUsed}>₹{coverageHospitalUsed.toLocaleString()} used</Text>
                  <Text style={styles.covTilePct}>{Math.round((coverageHospitalUsed / coverageHospitalLimit) * 100)}%</Text>
                </View>
              </View>

              {/* Home Care tile */}
              <View style={styles.covTile}>
                <View style={styles.covTileTop}>
                  <View style={[styles.covTileIcon, { backgroundColor: '#F5F3FF' }]}>
                    <Ionicons name="home" size={15} color="#7C3AED" />
                  </View>
                  <Text style={styles.covTileTitle}>Home Care</Text>
                  <Text style={styles.covTileLimit}>Max ₹80K</Text>
                </View>
                <View style={[styles.covTileBar, { backgroundColor: '#F5F3FF' }]}>
                  <View style={[styles.covTileBarFill, { width: `${Math.round((coverageHomeUsed / coverageHomeLimit) * 100)}%` as any, backgroundColor: '#7C3AED' }]} />
                </View>
                <View style={styles.covTileFooter}>
                  <Text style={styles.covTileUsed}>₹{coverageHomeUsed.toLocaleString()} used</Text>
                  <Text style={styles.covTilePct}>{Math.round((coverageHomeUsed / coverageHomeLimit) * 100)}%</Text>
                </View>
              </View>
            </View>

            {/* ── Footer CTA ── */}
            <TouchableOpacity style={styles.covCTA} onPress={() => router.push('/claims')}>
              <Ionicons name="document-text-outline" size={15} color={colors.primary} />
              <Text style={styles.covCTAText}>View All Claims</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ═══════════════════ QUICK ACTIONS ═════════════════════ */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.qaList}>
        {QUICK_ACTIONS.map((a, i) => (
          <TouchableOpacity key={i} style={styles.qaItem} onPress={() => router.push(a.route as any)}>
            <View style={[styles.qaIcon, { backgroundColor: a.bg }]}>
              <Ionicons name={a.icon as any} size={22} color={a.color} />
            </View>
            <Text style={styles.qaLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ═══════════════════ PROMO CAROUSEL ════════════════════ */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MedCred Benefits</Text>
        <View style={styles.dotRow}>
          {PROMO_SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeSlide && styles.dotActive]} />
          ))}
        </View>
      </View>
      <FlatList
        data={PROMO_SLIDES}
        horizontal pagingEnabled
        snapToInterval={BANNER_W + spacing.sm}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.carouselList}
        renderItem={({ item }) => (
          <View style={[styles.promoCard, { backgroundColor: item.color }]}>
            <View style={styles.promoGlow} />
            <View style={[styles.promoIconWrap, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
              <Ionicons name={item.icon} size={28} color="#fff" />
            </View>
            <Text style={styles.promoTitle}>{item.title}</Text>
            <Text style={styles.promoBody}>{item.body}</Text>
            <TouchableOpacity style={styles.promoBtn} onPress={() => router.push('/card')}>
              <Text style={[styles.promoBtnText, { color: item.color }]}>Learn More</Text>
              <Ionicons name="arrow-forward" size={13} color={item.color} />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ═══════════════════ SERVICES GRID ═════════════════════ */}
      <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
        <Text style={styles.sectionTitle}>Services</Text>
      </View>
      <View style={styles.grid}>
        {MODULES.map((m, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.moduleCard, { backgroundColor: m.bg, borderColor: m.color + '25' }]}
            activeOpacity={0.7}
            onPress={() => router.push(m.route as any)}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: m.color + '18' }]}>
              <Ionicons name={m.icon as any} size={26} color={m.color} />
            </View>
            <Text style={[styles.moduleLabel, { color: m.color }]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ═══════════════════ RECENT ACTIVITY ═══════════════════ */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity onPress={() => router.push('/claims')}>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.activityContainer}>
        {(user?.claims?.slice(0, 3) ?? []).length > 0 ? (
          (user!.claims!.slice(0, 3)).map((c) => (
            <TouchableOpacity key={c.id} style={styles.activityRow} onPress={() => router.push(`/claims/${c.id}` as any)}>
              <View style={styles.activityIconWrap}>
                <Ionicons name="document-text" size={18} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle} numberOfLines={1}>Claim — {c.hospitalName ?? 'Treatment'}</Text>
                <Text style={styles.activitySub}>{c.treatmentDate}</Text>
              </View>
              <View style={styles.activityRight}>
                <Text style={styles.activityAmt}>₹{c.amount?.toLocaleString()}</Text>
                <View style={[styles.activityStatus, { backgroundColor: c.status === 'Approved' ? '#ECFDF5' : c.status === 'Rejected' ? '#FEF2F2' : '#FFFBEB' }]}>
                  <Text style={[styles.activityStatusText, { color: c.status === 'Approved' ? '#059669' : c.status === 'Rejected' ? '#DC2626' : '#B45309' }]}>
                    {c.status === 'UnderReview' ? 'In Review' : c.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyActivity}>
            <Ionicons name="receipt-outline" size={34} color="#D1D5DB" />
            <Text style={styles.emptyActivityText}>No recent claims</Text>
          </View>
        )}
      </View>

      {/* ═══════════════════ FEATURED HOSPITALS ════════════════ */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Partner Hospitals</Text>
        <TouchableOpacity onPress={() => router.push('/hospitals')}>
          <Text style={styles.seeAll}>View all →</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hospitalList}>
        {FEATURED_HOSPITALS.map((h) => (
          <TouchableOpacity key={h.id} style={styles.hospitalCard} onPress={() => router.push(`/hospitals/${h.id}` as any)}>
            <View style={[styles.hospitalAvatar, { backgroundColor: h.color + '18' }]}>
              <Ionicons name="business" size={24} color={h.color} />
            </View>
            <Text style={styles.hospitalName} numberOfLines={2}>{h.name}</Text>
            <Text style={styles.hospitalCity}>{h.city}</Text>
            <View style={[styles.hospitalTypeBadge, { backgroundColor: h.color + '15' }]}>
              <Text style={[styles.hospitalTypeText, { color: h.color }]}>{h.type}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ═══════════════════ WHY MEDCRED (ACCORDION) ═══════════ */}
      <TouchableOpacity style={styles.accordionHeader} onPress={toggleWhySection} activeOpacity={0.8}>
        <View style={styles.accordionHeaderLeft}>
          <View style={styles.accordionIconWrap}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
          </View>
          <Text style={styles.accordionHeaderText}>Why MedCred?</Text>
        </View>
        <Ionicons name={whyOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#6B7280" />
      </TouchableOpacity>

      {whyOpen && (
        <View style={styles.accordionBody}>
          {WHY_ITEMS.map((item, i) => (
            <View key={i}>
              <TouchableOpacity style={styles.faqRow} onPress={() => toggleWhyItem(i)} activeOpacity={0.8}>
                <View style={[styles.faqIconWrap, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
                <Text style={styles.faqTitle}>{item.title}</Text>
                <Ionicons name={openWhyIdx === i ? 'remove' : 'add'} size={18} color="#9CA3AF" />
              </TouchableOpacity>
              {openWhyIdx === i && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.desc}</Text>
                </View>
              )}
              {i < WHY_ITEMS.length - 1 && <View style={styles.faqDivider} />}
            </View>
          ))}
        </View>
      )}

    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll:    { paddingBottom: 90 },

  // Header
  header:   { backgroundColor: colors.primary, paddingTop: 52, paddingHorizontal: spacing.lg, paddingBottom: 26, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden', marginBottom: spacing.lg },
  hBg1:     { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -40 },
  hBg2:     { position: 'absolute', width: 130, height: 130, borderRadius: 65,  backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, left: -20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  greeting:  { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginBottom: 2 },
  userName:  { fontSize: 21, fontWeight: '800', color: '#fff', maxWidth: 210 },
  hIconBtn:  { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  notifDot:  { position: 'absolute', top: 7, right: 7, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.danger, justifyContent: 'center', alignItems: 'center' },
  notifDotText: { fontSize: 7, color: '#fff', fontWeight: '700' },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  hBanner:   { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 14, padding: 12 },
  hBannerIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  hBannerTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  hBannerSub:   { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  simBtn:    { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  simBtnText: { fontSize: 11, fontWeight: '700', color: colors.primary },

  // Stats
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  statIcon: { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statVal:  { fontSize: 17, fontWeight: '800', color: '#1C1C1E' },
  statLabel:{ fontSize: 11, color: '#6B7280', fontWeight: '500', marginTop: 2 },

  // ─── Coverage Card (premium redesign) ───────────────────────
  section: { paddingHorizontal: spacing.md, marginBottom: spacing.lg },
  coverageCard: { backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', elevation: 4, shadowColor: '#1A73E8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 14 },

  // Dark header band
  coverageHeader: { backgroundColor: '#0F172A', padding: 18, overflow: 'hidden' },
  covHdrBg: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.04)', top: -60, right: -40 },
  covHdrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  covHdrLabel: { fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  covHdrAmount: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  covHdrBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#059669', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  covHdrBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  covHdrSub: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '500' },

  // Body
  covBody: { padding: 16, gap: 14 },
  covTotalsRow: { flexDirection: 'row', alignItems: 'center' },
  covTotalItem: { flex: 1, alignItems: 'center' },
  covTotalVal: { fontSize: 17, fontWeight: '800', color: '#1C1C1E', marginBottom: 2 },
  covTotalLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase' },
  covDivider: { width: 1, height: 32, backgroundColor: '#E5E7EB' },

  // Master bar
  covMasterBar: { height: 10, backgroundColor: '#F3F4F6', borderRadius: 5, overflow: 'hidden' },
  covMasterFill: { height: '100%', backgroundColor: '#1A73E8', borderRadius: 5 },

  // Breakdown tiles
  covTiles: { flexDirection: 'row', gap: 10 },
  covTile: { flex: 1, backgroundColor: '#FAFAFA', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#F0F0F0', gap: 6 },
  covTileTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  covTileIcon: { width: 26, height: 26, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  covTileTitle: { flex: 1, fontSize: 12, fontWeight: '700', color: '#374151' },
  covTileLimit: { fontSize: 10, color: '#9CA3AF', fontWeight: '600' },
  covTileBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  covTileBarFill: { height: '100%', borderRadius: 3 },
  covTileFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  covTileUsed: { fontSize: 11, color: '#374151', fontWeight: '700' },
  covTilePct:  { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },

  // Footer CTA
  covCTA: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, backgroundColor: '#EEF4FF', borderRadius: 12 },
  covCTAText: { fontSize: 13, fontWeight: '700', color: colors.primary },

  // ─── legacy coverage styles kept for reference ──────────────
  coverageTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  coverageTitle: { fontSize: 15, fontWeight: '800', color: '#1C1C1E' },
  coverageSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  coverageChip: { backgroundColor: '#EEF4FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  coverageChipText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  coverageAmtRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  coverageUsed:  { fontSize: 22, fontWeight: '800', color: '#1A73E8' },
  coverageOf:    { fontSize: 13, color: '#6B7280' },
  coverageTotal: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: '#1A73E8', borderRadius: 4 },
  coverageFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  coverageRemText: { fontSize: 12, color: '#059669', fontWeight: '600' },
  coveragePct:     { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  coverageTotalAmt: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  coverageBreakdown: { gap: 10, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  coverageBreakItem: { flexDirection: 'row', alignItems: 'center' },
  coverageBreakLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 76 },
  coverageBreakDot:  { width: 8, height: 8, borderRadius: 4 },
  coverageBreakLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600' },
  coverageBreakAmt:   { fontSize: 11, color: '#1C1C1E', fontWeight: '700', width: 80, textAlign: 'right' },
  miniTrack: { height: 5, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  miniFill:  { height: '100%', borderRadius: 3 },

  // Section Headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: 10 },
  sectionTitle:  { fontSize: 16, fontWeight: '800', color: '#1C1C1E' },
  seeAll:        { fontSize: 13, fontWeight: '600', color: colors.primary },

  // Quick Actions
  qaList: { paddingHorizontal: spacing.md, gap: 12, paddingBottom: 4, marginBottom: spacing.lg },
  qaItem: { alignItems: 'center', gap: 6, width: 68 },
  qaIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  qaLabel: { fontSize: 11, fontWeight: '600', color: '#374151', textAlign: 'center' },

  // Promo Carousel
  dotRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
  dotActive: { width: 18, borderRadius: 3, backgroundColor: colors.primary },
  carouselList: { paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.sm },
  promoCard: { width: BANNER_W, borderRadius: 20, padding: 20, overflow: 'hidden', minHeight: 175 },
  promoGlow: { position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.08)' },
  promoIconWrap: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  promoTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 6 },
  promoBody:  { fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 18, flex: 1 },
  promoBtn:   { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.94)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  promoBtnText: { fontSize: 12, fontWeight: '700' },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, gap: 12, marginBottom: spacing.sm },
  moduleCard: { width: CARD_W, borderRadius: 18, alignItems: 'center', paddingVertical: 18, paddingHorizontal: 8, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  moduleIconBox: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  moduleLabel: { fontSize: 12, fontWeight: '700', textAlign: 'center' },

  // Recent Activity
  activityContainer: { paddingHorizontal: spacing.md, gap: 8, marginBottom: spacing.lg },
  activityRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', gap: 12, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  activityIconWrap: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center' },
  activityTitle: { fontSize: 13, fontWeight: '700', color: '#1C1C1E', marginBottom: 2 },
  activitySub:   { fontSize: 11, color: '#6B7280' },
  activityRight: { alignItems: 'flex-end', gap: 4 },
  activityAmt:   { fontSize: 14, fontWeight: '800', color: '#1C1C1E' },
  activityStatus: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  activityStatusText: { fontSize: 10, fontWeight: '700' },
  emptyActivity: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyActivityText: { fontSize: 13, color: '#9CA3AF' },

  // Featured Hospitals
  hospitalList: { paddingHorizontal: spacing.md, gap: 10, paddingBottom: 4, marginBottom: spacing.lg },
  hospitalCard: { width: 140, backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E5E7EB', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
  hospitalAvatar: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  hospitalName: { fontSize: 13, fontWeight: '700', color: '#1C1C1E', marginBottom: 3 },
  hospitalCity: { fontSize: 11, color: '#6B7280', marginBottom: 8 },
  hospitalTypeBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  hospitalTypeText:  { fontSize: 10, fontWeight: '700' },

  // Why MedCred Accordion
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: spacing.md, backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 4, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  accordionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  accordionIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#EEF4FF', justifyContent: 'center', alignItems: 'center' },
  accordionHeaderText: { fontSize: 15, fontWeight: '800', color: '#1C1C1E' },
  accordionBody: { marginHorizontal: spacing.md, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', marginBottom: spacing.xl },
  faqRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  faqIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  faqTitle: { flex: 1, fontSize: 13, fontWeight: '700', color: '#1C1C1E' },
  faqAnswer: { paddingHorizontal: 16, paddingBottom: 14 },
  faqAnswerText: { fontSize: 13, color: '#6B7280', lineHeight: 19, paddingLeft: 48 },
  faqDivider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 14 },
});
