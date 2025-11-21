
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatarData } from '../utils/helpers';
import type { Evento } from '../utils/types'

interface Props {
  evento: Evento;
  onPress: () => void;
  onDelete: () => void;
}

export const EventoCard: React.FC<Props> = ({ evento, onPress, onDelete }) => {
  return (
    <View style={[styles.card, { borderLeftColor: evento.cor || '#3788d8' }]}>
      <TouchableOpacity style={styles.conteudo} onPress={onPress}>
        <Text style={styles.titulo}>{evento.titulo}</Text>
        <Text style={styles.info}>🕐 {formatarData(evento.dataInicio)}</Text>
        {evento.local && <Text style={styles.info}>📍 {evento.local}</Text>}
        {evento.recorrente && (
          <Text style={styles.badge}>{evento.tipoRecorrencia}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.acoes}>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.icone}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.icone}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
  },
  conteudo: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  info: {
    color: '#666',
    marginTop: 4,
    fontSize: 13,
  },
  badge: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
    fontSize: 11,
  },
  acoes: {
    justifyContent: 'space-around',
    paddingLeft: 10,
  },
  icone: {
    fontSize: 20,
  },
});