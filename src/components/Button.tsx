import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button = ({ children, onPress, variant = 'primary', disabled, style }: ButtonProps) => {
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'danger' && styles.danger,
    disabled && styles.disabled,
    style
  ];

  const textStyle = [
    styles.text,
    variant === 'secondary' && styles.secondaryText
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primary: {
    backgroundColor: '#3788d8'
  },
  secondary: {
    backgroundColor: '#e5e7eb'
  },
  danger: {
    backgroundColor: '#ef4444'
  },
  disabled: {
    backgroundColor: '#9ca3af'
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryText: {
    color: '#374151'
  }
});