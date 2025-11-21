import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { Calendario } from '../utils/types'

interface Props {
  calendario: Calendario;
  onPress: () => void;
  onLongPress: () => void;
}

export const CalendarioCard: React.FC<Props> = ({ calendario, onPress, onLongPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: calendario.cor }]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.titulo}>{calendario.nome}</Text>
      <Text style={styles.descricao}>
        {calendario.descricao || 'Sem descrição'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  descricao: {
    color: '#666',
    marginTop: 4,
    fontSize: 13,
  },
});