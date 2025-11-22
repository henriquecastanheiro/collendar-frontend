import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Calendario } from '../types';

interface CalendarioCardProps {
  calendario: Calendario;
  onPress: () => void;
}

export const CalendarioCard = ({ calendario, onPress }: CalendarioCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={[styles.icon, { backgroundColor: calendario.cor + '20' }]}>
      <View style={[styles.dot, { backgroundColor: calendario.cor }]} />
    </View>
    <View style={styles.content}>
      <Text style={styles.title}>{calendario.nome}</Text>
      <Text style={styles.description}>{calendario.descricao}</Text>
    </View>
    <View style={[styles.indicator, { backgroundColor: calendario.cor }]} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#6b7280'
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6
  }
});
