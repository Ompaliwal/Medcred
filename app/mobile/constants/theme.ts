/**
 * MedCred India — Design Tokens
 * Used across all screens in the mobile app.
 */

import { Platform } from 'react-native';

// ─── Colors ──────────────────────────────────────────────────────────────────
export const colors = {
  primary:    '#1A73E8',   // main blue
  secondary:  '#34A853',   // green (success, active)
  danger:     '#EA4335',   // red (rejected, blocked)
  warning:    '#FBBC04',   // yellow (pending)
  background: '#F5F7FA',   // light grey bg
  white:      '#FFFFFF',
  text:       '#1C1C1E',   // near black
  subtext:    '#6B7280',   // grey text
  border:     '#E5E7EB',

  // Extended palette for UI
  primaryLight:   '#E8F0FE',
  primaryDark:    '#1557B0',
  secondaryLight: '#E6F4EA',
  dangerLight:    '#FDECEA',
  warningLight:   '#FEF8E1',
  overlay:        'rgba(0,0,0,0.5)',
  cardBg:         '#FFFFFF',
  inputBg:        '#F9FAFB',
  disabled:       '#D1D5DB',
  disabledText:   '#9CA3AF',
};

// Keep backward-compat with existing components that use Colors.light / Colors.dark
export const Colors = {
  light: {
    text:           colors.text,
    background:     colors.background,
    tint:           colors.primary,
    icon:           colors.subtext,
    tabIconDefault: colors.subtext,
    tabIconSelected: colors.primary,
  },
  dark: {
    text:           '#ECEDEE',
    background:     '#151718',
    tint:           '#FFFFFF',
    icon:           '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
  },
};

// ─── Typography ──────────────────────────────────────────────────────────────
export const typography = {
  h1:      { fontSize: 28, fontWeight: '700' as const, color: colors.text },
  h2:      { fontSize: 22, fontWeight: '600' as const, color: colors.text },
  h3:      { fontSize: 18, fontWeight: '600' as const, color: colors.text },
  body:    { fontSize: 14, fontWeight: '400' as const, color: colors.text },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.subtext },
};

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const borderRadius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 9999,
};

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#1A73E8',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
    default: {},
  }),
};

// ─── Fonts (system) ──────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',
    mono:    'ui-monospace',
  },
  default: {
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
