import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Evento } from '../types';

interface EventoCardProps {
  evento: Evento;
  onEdit: () => void;
  onDelete: () => void;
}

export const EventoCard = ({ evento, onEdit, onDelete }: EventoCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={[styles.card, { borderLeftColor: evento.cor || '#3788d8' }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{evento.titulo}</Text>
        <Text style={styles.description}>{evento.descricao}</Text>
        <View style={styles.info}>
          <Text style={styles.infoText}>🕐 {formatDate(evento.dataInicio)}</Text>
          {evento.local && <Text style={styles.infoText}>📍 {evento.local}</Text>}
        </View>
        {evento.recorrente && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{evento.tipoRecorrencia}</Text>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  content: {
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8
  },
  info: {
    gap: 4
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280'
  },
  badge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8
  },
  badgeText: {
    fontSize: 10,
    color: '#1e40af',
    fontWeight: '600'
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end'
  },
  actionButton: {
    padding: 8
  },
  actionText: {
    fontSize: 18
  }
});
