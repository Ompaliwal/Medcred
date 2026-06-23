/**
 * AuthInput — Styled text input with label, icon, and error state.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, typography, borderRadius, spacing } from '@/constants/theme';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export default function AuthInput({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  required,
  secureTextEntry,
  ...props
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View
        style={[
          styles.inputWrap,
          isFocused && styles.inputWrapFocused,
          hasError && styles.inputWrapError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          {...props}
          secureTextEntry={isSecure}
          placeholderTextColor={colors.subtext}
          style={[
            styles.input,
            leftIcon  ? styles.inputWithLeft  : null,
            rightIcon ? styles.inputWithRight : null,
          ]}
          onFocus={() => {
            setIsFocused(true);
            props.onFocus?.({} as any);
          }}
          onBlur={() => {
            setIsFocused(false);
            props.onBlur?.({} as any);
          }}
        />

        {/* Password toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setIsSecure(p => !p)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.toggleText}>{isSecure ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        )}

        {/* Custom right icon (not password) */}
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {hasError && <Text style={styles.error}>{error}</Text>}
      {hint && !hasError && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  required: {
    color: colors.danger,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    height: 50,
    paddingHorizontal: spacing.md,
  },
  inputWrapFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  inputWrapError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: 0,
  },
  inputWithLeft: {
    marginLeft: spacing.sm,
  },
  inputWithRight: {
    marginRight: spacing.sm,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
  },
  toggleText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: 4,
  },
  hint: {
    ...typography.caption,
    color: colors.subtext,
    marginTop: 4,
  },
});
