import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CompartilhamentoCard } from '../components/CompartilhamentoCard';
import { mockCompartilhamentos, mockUsuariosDisponiveis } from '../api/mockData';
import type { Calendario, Compartilhamento, Usuario } from '../types';

interface CompartilharScreenProps {
  calendario: Calendario;
  onBack: () => void;
}

export const CompartilharScreen = ({ calendario, onBack }: CompartilharScreenProps) => {
  const [compartilhamentos, setCompartilhamentos] = useState<Compartilhamento[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setCompartilhamentos(mockCompartilhamentos.filter(c => c.calendarioId === calendario.id));
      setUsuarios(mockUsuariosDisponiveis);
      setLoading(false);
    }, 500);
  }, [calendario.id]);

  const handleChangePermission = (comp: Compartilhamento) => {
    setCompartilhamentos(prev =>
      prev.map(c =>
        c.id === comp.id
          ? { ...c, permissao: c.permissao === 'VISUALIZAR' ? 'EDITAR' : 'VISUALIZAR' }
          : c
      )
    );
  };

  const handleRemove = (compId: string) => {
    setCompartilhamentos(prev => prev.filter(c => c.id !== compId));
  };

  const handleAddUser = (usuario: Usuario) => {
    const novoComp: Compartilhamento = {
      id: Date.now().toString(),
      calendarioId: calendario.id,
      calendarioNome: calendario.nome,
      usuarioId: usuario.id,
      usuarioNome: usuario.nome,
      permissao: 'VISUALIZAR'
    };
    setCompartilhamentos(prev => [...prev, novoComp]);
    setShowAddUser(false);
    setSearchText('');
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(searchText.toLowerCase()) &&
    !compartilhamentos.some(c => c.usuarioId === u.id)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Compartilhar</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.calendarInfo}>
        <View style={[styles.colorDot, { backgroundColor: calendario.cor }]} />
        <Text style={styles.calendarName}>{calendario.nome}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Compartilhado com ({compartilhamentos.length})</Text>
            <TouchableOpacity onPress={() => setShowAddUser(!showAddUser)} style={styles.addButton}>
              <Text style={styles.addButtonText}>{showAddUser ? '✕' : '+'} Adicionar</Text>
            </TouchableOpacity>
          </View>

          {showAddUser && (
            <View style={styles.addUserSection}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar usuário..."
                value={searchText}
                onChangeText={setSearchText}
              />
              {usuariosFiltrados.map(usuario => (
                <TouchableOpacity
                  key={usuario.id}
                  style={styles.userItem}
                  onPress={() => handleAddUser(usuario)}
                >
                  <View style={styles.userIcon}>
                    <Text style={styles.userIconText}>{usuario.nome.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={styles.userName}>{usuario.nome}</Text>
                  <Text style={styles.addIcon}>+</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : compartilhamentos.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Ainda não compartilhado com ninguém</Text>
            </View>
          ) : (
            compartilhamentos.map(comp => (
              <CompartilhamentoCard
                key={comp.id}
                compartilhamento={comp}
                onChangePermission={() => handleChangePermission(comp)}
                onRemove={() => handleRemove(comp.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  backButton: {
    padding: 8
  },
  backText: {
    fontSize: 24,
    color: '#6b7280'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  calendarInfo: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8
  },
  calendarName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },
  content: {
    flex: 1,
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },
  addButton: {
    backgroundColor: '#3788d8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  addUserSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  userIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280'
  },
  userName: {
    flex: 1,
    fontSize: 15,
    color: '#374151'
  },
  addIcon: {
    fontSize: 24,
    color: '#3788d8'
  },
  empty: {
    padding: 32,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center'
  }
});