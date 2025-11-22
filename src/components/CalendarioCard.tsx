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
      <View style={styles.titleRow}>
        <Text style={styles.title}>{calendario.nome}</Text>
        {!calendario.ehProprietario && (
          <View style={styles.sharedBadge}>
            <Text style={styles.sharedText}>👥</Text>
          </View>
        )}
      </View>
      <Text style={styles.description}>{calendario.descricao}</Text>
      {!calendario.ehProprietario && (
        <Text style={styles.owner}>Por: {calendario.usuarioNome}</Text>
      )}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  sharedBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  sharedText: {
    fontSize: 12
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2
  },
  owner: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    fontStyle: 'italic'
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6
  }
});