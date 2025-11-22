import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const COLORS = ['#3788d8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>Cor</Text>
    <View style={styles.colors}>
      {COLORS.map(color => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorButton,
            { backgroundColor: color },
            value === color && styles.selected
          ]}
          onPress={() => onChange(color)}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8
  },
  colors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selected: {
    borderColor: '#000',
    transform: [{ scale: 1.1 }]
  }
});
