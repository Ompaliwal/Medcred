/**
 * OTPInput — 6-box OTP input with auto-focus and backspace handling.
 */

import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { colors, borderRadius } from '@/constants/theme';

const OTP_LENGTH = 6;

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
  hasError?: boolean;
}

export default function OTPInput({ value, onChange, hasError }: OTPInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);
  const [focused, setFocused] = useState<number>(-1);

  const digits = value.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH);

  const handleChange = (text: string, index: number) => {
    // Only accept single digit
    const cleaned = text.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    const newOtp = newDigits.join('');
    onChange(newOtp);

    // Auto-advance
    if (cleaned && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      onChange(newDigits.join(''));
    }
  };

  return (
    <View style={styles.container}>
      {digits.map((digit, i) => (
        <TextInput
          key={i}
          ref={ref => { inputs.current[i] = ref; }}
          style={[
            styles.box,
            focused === i && styles.boxFocused,
            digit && styles.boxFilled,
            hasError && styles.boxError,
          ]}
          value={digit}
          onChangeText={text => handleChange(text, i)}
          onKeyPress={e => handleKeyPress(e, i)}
          onFocus={() => setFocused(i)}
          onBlur={() => setFocused(-1)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          returnKeyType="next"
          selectTextOnFocus
          caretHidden={false}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 8,
  },
  box: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.inputBg,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  boxFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  boxFilled: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondaryLight,
  },
  boxError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
});
