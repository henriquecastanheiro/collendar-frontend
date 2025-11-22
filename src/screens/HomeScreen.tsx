import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { CalendarioCard } from '../components/CalendarioCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { mockCalendarios, mockCalendariosCompartilhados } from '../api/mockData';
import type { Usuario, Calendario } from '../types';

interface HomeScreenProps {
  user: Usuario;
  onLogout: () => void;
  onSelectCalendario: (calendario: Calendario) => void;
  onCreateCalendario: () => void;
}

type Tab = 'meus' | 'compartilhados';

export const HomeScreen = ({ user, onLogout, onSelectCalendario, onCreateCalendario }: HomeScreenProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('meus');
  const [meusCalendarios, setMeusCalendarios] = useState<Calendario[]>([]);
  const [calendariosCompartilhados, setCalendariosCompartilhados] = useState<Calendario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMeusCalendarios(mockCalendarios);
      setCalendariosCompartilhados(mockCalendariosCompartilhados);
      setLoading(false);
    }, 800);
  }, []);

  const calendarios = activeTab === 'meus' ? meusCalendarios : calendariosCompartilhados;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user.nome.split(' ')[0]}!</Text>
          <Text style={styles.subtitle}>
            {activeTab === 'meus' ? 'Seus calendários' : 'Compartilhados com você'}
          </Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* TAB NAVIGATION */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'meus' && styles.activeTab]}
          onPress={() => setActiveTab('meus')}
        >
          <Text style={[styles.tabText, activeTab === 'meus' && styles.activeTabText]}>
            📅 Meus Calendários
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'compartilhados' && styles.activeTab]}
          onPress={() => setActiveTab('compartilhados')}
        >
          <Text style={[styles.tabText, activeTab === 'compartilhados' && styles.activeTabText]}>
            👥 Compartilhados
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <LoadingSpinner />
        ) : calendarios.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              {activeTab === 'meus' ? '📅' : '👥'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'meus' 
                ? 'Nenhum calendário criado' 
                : 'Nenhum calendário compartilhado com você'}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {calendarios.map((c) => (
              <CalendarioCard key={c.id} calendario={c} onPress={() => onSelectCalendario(c)} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB - Só aparece na tab "Meus Calendários" */}
      {activeTab === 'meus' && (
        <TouchableOpacity style={styles.fab} onPress={onCreateCalendario}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: '#3788d8'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280'
  },
  activeTabText: {
    color: '#3788d8',
    fontWeight: '600'
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
    color: '#9ca3af',
    textAlign: 'center'
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