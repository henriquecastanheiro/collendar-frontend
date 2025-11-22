import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ColorPicker } from '../components/ColorPicker';
import type { Calendario } from '../types';

interface CalendarioFormScreenProps {
  calendario: Calendario | null;
  onSave: () => void;
  onCancel: () => void;
}

export const CalendarioFormScreen = ({ calendario, onSave, onCancel }: CalendarioFormScreenProps) => {
  const [nome, setNome] = useState(calendario?.nome || '');
  const [descricao, setDescricao] = useState(calendario?.descricao || '');
  const [cor, setCor] = useState(calendario?.cor || '#3788d8');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!nome) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSave();
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{calendario ? 'Editar' : 'Novo'} Calendário</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Ex: Trabalho" />
        <Input
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição opcional"
        />
        <ColorPicker value={cor} onChange={setCor} />
      </ScrollView>

      <View style={styles.footer}>
        <Button variant="secondary" onPress={onCancel} style={styles.button}>
          Cancelar
        </Button>
        <Button onPress={handleSave} disabled={loading || !nome} style={styles.button}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </View>
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
  closeButton: {
    padding: 8
  },
  closeText: {
    fontSize: 24,
    color: '#6b7280'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  content: {
    flex: 1,
    padding: 16
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  button: {
    flex: 1
  }
});