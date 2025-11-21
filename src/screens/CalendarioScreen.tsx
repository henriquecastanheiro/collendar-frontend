import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Alert,
  ActivityIndicator, SafeAreaView, StyleSheet, Modal, TextInput
} from 'react-native';
import { listarEventos, criarEvento, atualizarEvento, excluirEvento } from '../utils/api';
import { formatarData } from '../utils/helpers';
import { EventoCard } from '../components/EventoCard';
import type { Calendario, Evento } from '../types';

interface Props {
  calendario: Calendario;
  onVoltar: () => void;
}

export const CalendarioScreen: React.FC<Props> = ({ calendario, onVoltar }) => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Evento | null>(null);

  // Form
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [local, setLocal] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    try {
      const data = await listarEventos(calendario.id);
      setEventos(data || []);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirModal = (evento?: Evento) => {
    if (evento) {
      setEditando(evento);
      setTitulo(evento.titulo);
      setDescricao(evento.descricao || '');
      setDataInicio(evento.dataInicio?.slice(0, 16) || '');
      setDataFim(evento.dataFim?.slice(0, 16) || '');
      setLocal(evento.local || '');
    } else {
      setEditando(null);
      setTitulo('');
      setDescricao('');
      setDataInicio('');
      setDataFim('');
      setLocal('');
    }
    setModal(true);
  };

  const salvar = async () => {
    if (!titulo || !dataInicio || !dataFim) {
      return Alert.alert('Erro', 'Preencha título e datas');
    }

    setSalvando(true);
    try {
      const dados = {
        titulo,
        descricao,
        dataInicio,
        dataFim,
        local,
        cor: calendario.cor,
        diaInteiro: false,
        recorrente: false,
      };

      if (editando) {
        await atualizarEvento(editando.id, dados);
      } else {
        await criarEvento(calendario.id, dados);
      }
      setModal(false);
      carregar();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
    setSalvando(false);
  };

  const excluir = (id: string) => {
    Alert.alert('Excluir', 'Confirma exclusão do evento?', [
      { text: 'Não' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          await excluirEvento(id);
          carregar();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar}>
          <Text style={styles.voltarTxt}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTxt}>{calendario.nome}</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum evento criado</Text>
          }
          renderItem={({ item }) => (
            <EventoCard
              evento={item}
              onPress={() => abrirModal(item)}
              onDelete={() => excluir(item.id)}
            />
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => abrirModal()}>
        <Text style={styles.fabTxt}>+</Text>
      </TouchableOpacity>

      {/* Modal Criar/Editar */}
      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              {editando ? 'Editar' : 'Novo'} Evento
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título *"
              value={titulo}
              onChangeText={setTitulo}
            />

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Início (2025-11-25T14:00)"
              value={dataInicio}
              onChangeText={setDataInicio}
            />

            <TextInput
              style={styles.input}
              placeholder="Fim (2025-11-25T16:00)"
              value={dataFim}
              onChangeText={setDataFim}
            />

            <TextInput
              style={styles.input}
              placeholder="Local"
              value={local}
              onChangeText={setLocal}
            />

            <View style={styles.btnsContainer}>
              <TouchableOpacity
                style={[styles.btn, styles.btnSec]}
                onPress={() => setModal(false)}
              >
                <Text style={styles.btnTxtSec}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn}
                onPress={salvar}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnTxt}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTxt: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  voltarTxt: {
    color: '#3788d8',
    fontSize: 16,
  },
  vazio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3788d8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabTxt: {
    color: '#fff',
    fontSize: 30,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  btnsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    backgroundColor: '#3788d8',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  btnSec: {
    backgroundColor: '#e5e5e5',
  },
  btnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnTxtSec: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});