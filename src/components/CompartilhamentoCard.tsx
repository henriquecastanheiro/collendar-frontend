import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Compartilhamento } from '../types';

interface CompartilhamentoCardProps {
  compartilhamento: Compartilhamento;
  onChangePermission: () => void;
  onRemove: () => void;
}

export const CompartilhamentoCard = ({ 
  compartilhamento, 
  onChangePermission,
  onRemove 
}: CompartilhamentoCardProps) => (
  <View style={styles.card}>
    <View style={styles.userIcon}>
      <Text style={styles.userIconText}>
        {compartilhamento.usuarioNome.charAt(0).toUpperCase()}
      </Text>
    </View>
    <View style={styles.content}>
      <Text style={styles.name}>{compartilhamento.usuarioNome}</Text>
      <View style={styles.permissionRow}>
        <Text style={styles.permissionLabel}>
          {compartilhamento.permissao === 'EDITAR' ? '✏️ Pode editar' : '👁️ Apenas visualizar'}
        </Text>
      </View>
    </View>
    <View style={styles.actions}>
      <TouchableOpacity onPress={onChangePermission} style={styles.actionButton}>
        <Text style={styles.actionText}>🔄</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRemove} style={styles.actionButton}>
        <Text style={styles.actionText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  </View>
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
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3788d8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  userIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  content: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  permissionLabel: {
    fontSize: 13,
    color: '#6b7280'
  },
  actions: {
    flexDirection: 'row',
    gap: 4
  },
  actionButton: {
    padding: 8
  },
  actionText: {
    fontSize: 16
  }
});