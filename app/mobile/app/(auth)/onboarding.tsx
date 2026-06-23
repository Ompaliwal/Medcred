/**
 * Onboarding — 3-slide carousel introducing MedCred features.
 * Swipeable with dot indicators and Skip/Next/Get Started CTAs.
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  ListRenderItem,
} from 'react-native';
import { router } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  bgColor: string;
  iconBg: string;
  accent: string;
  bullets: string[];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Your Digital\nHealth Card',
    subtitle: 'One card, complete protection',
    emoji: '💳',
    bgColor: '#EBF3FD',
    iconBg: colors.primary,
    accent: colors.primary,
    bullets: [
      'Individual & Family Plans',
      'Instant card generation',
      'Digital + Physical card',
    ],
  },
  {
    id: '2',
    title: 'Instant Claim\nSupport',
    subtitle: 'Fast, transparent claim processing',
    emoji: '🏥',
    bgColor: '#E6F4EA',
    iconBg: colors.secondary,
    accent: colors.secondary,
    bullets: [
      'Hospital claims up to ₹2 Lakh',
      'Home treatment up to ₹80K',
      'Real-time claim tracking',
    ],
  },
  {
    id: '3',
    title: 'Family\nProtection Plans',
    subtitle: 'Cover every member you love',
    emoji: '👨‍👩‍👧‍👦',
    bgColor: '#FEF8E1',
    iconBg: colors.warning,
    accent: colors.warning,
    bullets: [
      'Add spouse, children & parents',
      'Shared family coverage limit',
      'Individual member health cards',
    ],
  },
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goToNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      router.replace('/(auth)/welcome');
    }
  };

  const skip = () => {
    router.replace('/(auth)/welcome');
  };

  const renderSlide: ListRenderItem<Slide> = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      {/* Illustration area */}
      <View style={[styles.illustrationBg, { backgroundColor: item.bgColor }]}>
        <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>

        {/* Floating decorative shapes */}
        <View style={[styles.floatDot1, { backgroundColor: item.accent + '30' }]} />
        <View style={[styles.floatDot2, { backgroundColor: item.accent + '20' }]} />
        <View style={[styles.floatDot3, { backgroundColor: item.accent + '15' }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title]}>{item.title}</Text>
        <Text style={[styles.subtitle, { color: item.accent }]}>{item.subtitle}</Text>

        {/* Bullets */}
        <View style={styles.bulletList}>
          {item.bullets.map((bullet, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bulletDot, { backgroundColor: item.accent }]} />
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        scrollEventThrottle={16}
      />

      {/* Bottom controls */}
      <View style={styles.bottom}>
        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.35, 1, 0.35],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                    backgroundColor: SLIDES[activeIndex].accent,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Next / Get Started */}
        <TouchableOpacity
          style={[
            styles.nextBtn,
            { backgroundColor: SLIDES[activeIndex].accent },
          ]}
          onPress={goToNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {activeIndex === SLIDES.length - 1 ? 'Get Started →' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ILLUSTRATION_H = height * 0.42;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipBtn: {
    position: 'absolute',
    top: 52,
    right: spacing.lg,
    zIndex: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skipText: {
    ...typography.body,
    color: colors.subtext,
    fontWeight: '500',
  },

  // Slide layout
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  illustrationBg: {
    width: '100%',
    height: ILLUSTRATION_H,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 60,
  },
  // Floating decorative circles
  floatDot1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    top: 30,
    left: 20,
  },
  floatDot2: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    bottom: 40,
    right: 30,
  },
  floatDot3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -30,
    right: -20,
  },

  // Text content
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    alignSelf: 'stretch',
  },
  title: {
    ...typography.h1,
    fontSize: 30,
    lineHeight: 38,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    fontSize: 15,
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  bulletList: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bulletText: {
    ...typography.body,
    color: colors.text,
  },

  // Bottom controls
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    width: '100%',
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
