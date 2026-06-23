/**
 * StepIndicator — 3-step progress indicator for multi-step registration.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '@/constants/theme';

interface StepIndicatorProps {
  currentStep: number;   // 1-based
  totalSteps: number;
  labels?: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum  = i + 1;
        const isDone   = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <React.Fragment key={i}>
            {/* Step circle */}
            <View style={styles.stepCol}>
              <View
                style={[
                  styles.circle,
                  isDone   && styles.circleDone,
                  isActive && styles.circleActive,
                ]}
              >
                {isDone ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text style={[styles.stepNum, isActive && styles.stepNumActive]}>
                    {stepNum}
                  </Text>
                )}
              </View>
              {labels && (
                <Text
                  style={[
                    styles.label,
                    isActive && styles.labelActive,
                    isDone   && styles.labelDone,
                  ]}
                  numberOfLines={1}
                >
                  {labels[i]}
                </Text>
              )}
            </View>

            {/* Connector line between steps */}
            {i < totalSteps - 1 && (
              <View style={[styles.line, isDone && styles.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const CIRCLE_SIZE = 32;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  stepCol: {
    alignItems: 'center',
    width: 70,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  circleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepNum: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.subtext,
  },
  stepNumActive: {
    color: colors.white,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    ...typography.caption,
    color: colors.subtext,
    marginTop: 4,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  labelDone: {
    color: colors.secondary,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginBottom: 20,
  },
  lineDone: {
    backgroundColor: colors.secondary,
  },
});
