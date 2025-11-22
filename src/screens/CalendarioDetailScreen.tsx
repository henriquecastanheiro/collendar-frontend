import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { EventoCard } from '../components/EventoCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { mockEventos } from '../api/mockData';
import type { Calendario, Evento } from '../types';

interface CalendarioDetailScreenProps {
  calendario: Calendario;
  onBack: () => void;
  onEdit: (calendario: Calendario) => void;
  onCreateEvento: () => void;
  onEditEvento: (evento: Evento) => void;
}

export const CalendarioDetailScreen = ({
  calendario,
  onBack,
  onEdit,
  onCreateEvento,
  onEditEvento
}: CalendarioDetailScreenProps) => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEventos(mockEventos.filter((e) => e.calendarioId === calendario.id));
      setLoading(false);
    }, 500);
  }, [calendario.id]);

  const handleDelete = (id: string) => {
    setEventos(eventos.filter((e) => e.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{calendario.nome}</Text>
          <Text style={styles.subtitle}>{calendario.descricao}</Text>
        </View>
        <TouchableOpacity onPress={() => onEdit(calendario)} style={styles.editButton}>
          <Text style={styles.editText}>✏️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Eventos</Text>
        <Text style={styles.eventCount}>{eventos.length} evento(s)</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <LoadingSpinner />
        ) : eventos.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Nenhum evento ainda</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {eventos.map((e) => (
              <EventoCard
                key={e.id}
                evento={e}
                onEdit={() => onEditEvento(e)}
                onDelete={() => handleDelete(e.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={onCreateEvento}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  backButton: {
    padding: 8,
    marginRight: 8
  },
  backText: {
    fontSize: 24,
    color: '#6b7280'
  },
  headerContent: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280'
  },
  editButton: {
    padding: 8
  },
  editText: {
    fontSize: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },
  eventCount: {
    fontSize: 14,
    color: '#6b7280'
  },
  content: {
    flex: 1,
    padding: 16
  },
  list: {
    paddingBottom: 80
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
    opacity: 0.5
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af'
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#3788d8',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300'
  }
});