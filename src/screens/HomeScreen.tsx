import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Alert,
  ActivityIndicator, SafeAreaView, StyleSheet, Modal, TextInput
} from 'react-native';
import { listarCalendarios, criarCalendario, atualizarCalendario, excluirCalendario, logout } from '../utils/apit';
import { CORES } from '../utils/helpers';
import { CalendarioCard } from '../components/CalendarioCard';
import type { Usuario, Calendario } from '../utils/types';
interface Props {
  user: Usuario;
  onLogout: () => void;
  onAbrirCalendario: (cal: Calendario) => void;
}

export const HomeScreen: React.FC<Props> = ({ user, onLogout, onAbrirCalendario }) => {
  const [calendarios, setCalendarios] = useState<Calendario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Calendario | null>(null);

  // Form
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState(CORES[0]);
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    try {
      const data = await listarCalendarios(user.id);
      setCalendarios(data || []);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirModal = (cal?: Calendario) => {
    if (cal) {
      setEditando(cal);
      setNome(cal.nome);
      setDescricao(cal.descricao || '');
      setCor(cal.cor);
    } else {
      setEditando(null);
      setNome('');
      setDescricao('');
      setCor(CORES[0]);
    }
    setModal(true);
  };

  const salvar = async () => {
    if (!nome) return Alert.alert('Erro', 'Nome obrigatório');

    setSalvando(true);
    try {
      if (editando) {
        await atualizarCalendario(editando.id, { nome, descricao, cor });
      } else {
        await criarCalendario(user.id, { nome, descricao, cor });
      }
      setModal(false);
      carregar();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
    setSalvando(false);
  };

  const excluir = () => {
    Alert.alert('Excluir', 'Excluir calendário e todos eventos?', [
      { text: 'Não' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          await excluirCalendario(editando!.id);
          setModal(false);
          carregar();
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>Olá, {user.nome}!</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.sairTxt}>Sair</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={calendarios}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum calendário criado</Text>
          }
          renderItem={({ item }) => (
            <CalendarioCard
              calendario={item}
              onPress={() => onAbrirCalendario(item)}
              onLongPress={() => abrirModal(item)}
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
              {editando ? 'Editar' : 'Novo'} Calendário
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome *"
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
            />

            <Text style={styles.label}>Cor:</Text>
            <View style={styles.coresContainer}>
              {CORES.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCor(c)}
                  style={[
                    styles.corCirculo,
                    { backgroundColor: c },
                    cor === c && styles.corSelecionada,
                  ]}
                />
              ))}
            </View>

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

            {editando && (
              <TouchableOpacity
                style={[styles.btn, styles.btnDanger]}
                onPress={excluir}
              >
                <Text style={styles.btnTxt}>Excluir</Text>
              </TouchableOpacity>
            )}
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
  sairTxt: {
    color: '#ef4444',
    fontSize: 14,
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
  label: {
    marginBottom: 8,
    color: '#666',
    fontSize: 14,
  },
  coresContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  corCirculo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  corSelecionada: {
    borderWidth: 3,
    borderColor: '#333',
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
  btnDanger: {
    backgroundColor: '#ef4444',
    marginTop: 10,
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
