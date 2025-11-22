import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ColorPicker } from '../components/ColorPicker';
import type { Evento } from '../types';

interface EventoFormScreenProps {
  evento: Evento | null;
  calendarioId: string;
  onSave: () => void;
  onCancel: () => void;
}

export const EventoFormScreen = ({ evento, calendarioId, onSave, onCancel }: EventoFormScreenProps) => {
  const [titulo, setTitulo] = useState(evento?.titulo || '');
  const [descricao, setDescricao] = useState(evento?.descricao || '');
  const [dataInicio, setDataInicio] = useState(evento?.dataInicio || '');
  const [dataFim, setDataFim] = useState(evento?.dataFim || '');
  const [local, setLocal] = useState(evento?.local || '');
  const [cor, setCor] = useState(evento?.cor || '#3788d8');
  const [diaInteiro, setDiaInteiro] = useState(evento?.diaInteiro || false);
  const [recorrente, setRecorrente] = useState(evento?.recorrente || false);
  const [tipoRecorrencia, setTipoRecorrencia] = useState(evento?.tipoRecorrencia || 'SEMANAL');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!titulo || !dataInicio || !dataFim) return;
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
        <Text style={styles.title}>{evento ? 'Editar' : 'Novo'} Evento</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Input label="Título" value={titulo} onChangeText={setTitulo} placeholder="Ex: Reunião" />
        <Input
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição opcional"
        />
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data/Hora Início</Text>
          <TextInput
            style={styles.input}
            value={dataInicio}
            onChangeText={setDataInicio}
            placeholder="2025-11-21T10:00"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data/Hora Fim</Text>
          <TextInput
            style={styles.input}
            value={dataFim}
            onChangeText={setDataFim}
            placeholder="2025-11-21T11:00"
          />
        </View>

        <Input label="Local" value={local} onChangeText={setLocal} placeholder="Ex: Sala 01" />
        
        <ColorPicker value={cor} onChange={setCor} />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Dia inteiro</Text>
          <Switch value={diaInteiro} onValueChange={setDiaInteiro} />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Recorrente</Text>
          <Switch value={recorrente} onValueChange={setRecorrente} />
        </View>

        {recorrente && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Recorrência</Text>
            <View style={styles.pickerContainer}>
              {['DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL'].map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[styles.pickerOption, tipoRecorrencia === tipo && styles.pickerOptionSelected]}
                  onPress={() => setTipoRecorrencia(tipo as any)}
                >
                  <Text
                    style={[styles.pickerOptionText, tipoRecorrencia === tipo && styles.pickerOptionTextSelected]}
                  >
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button variant="secondary" onPress={onCancel} style={styles.button}>
          Cancelar
        </Button>
        <Button onPress={handleSave} disabled={loading || !titulo} style={styles.button}>
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
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 8
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151'
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  pickerOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  pickerOptionSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#3788d8'
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500'
  },
  pickerOptionTextSelected: {
    color: '#3788d8',
    fontWeight: '600'
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