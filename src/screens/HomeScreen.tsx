import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { CalendarioCard } from '../components/CalendarioCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { mockCalendarios } from '../api/mockData';
import type { Usuario, Calendario } from '../types';

interface HomeScreenProps {
  user: Usuario;
  onLogout: () => void;
  onSelectCalendario: (calendario: Calendario) => void;
  onCreateCalendario: () => void;
}

export const HomeScreen = ({ user, onLogout, onSelectCalendario, onCreateCalendario }: HomeScreenProps) => {
  const [calendarios, setCalendarios] = useState<Calendario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCalendarios(mockCalendarios);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user.nome.split(' ')[0]}!</Text>
          <Text style={styles.subtitle}>Seus calendários</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <View style={styles.list}>
            {calendarios.map((c) => (
              <CalendarioCard key={c.id} calendario={c} onPress={() => onSelectCalendario(c)} />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={onCreateCalendario}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280'
  },
  logoutButton: {
    padding: 8
  },
  logoutText: {
    fontSize: 24
  },
  content: {
    flex: 1,
    padding: 16
  },
  list: {
    paddingBottom: 80
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