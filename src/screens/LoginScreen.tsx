import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  ActivityIndicator, SafeAreaView, StyleSheet
} from 'react-native';
import { login, cadastrar } from '../utils/api';
import type { Usuario } from '../types';

interface Props {
  onLogin: (user: Usuario) => void;
}

export const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !senha || (modo === 'cadastro' && !nome)) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }

    setLoading(true);
    try {
      if (modo === 'cadastro') {
        await cadastrar(nome, email, senha);
        Alert.alert('Sucesso', 'Conta criada! Faça login.', [
          { text: 'OK', onPress: () => setModo('login') }
        ]);
      } else {
        const user = await login(email, senha);
        onLogin(user);
      }
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.logo}>📅 Collendar</Text>

        {modo === 'cadastro' && (
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnTxt}>
              {modo === 'login' ? 'Entrar' : 'Cadastrar'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setModo(modo === 'login' ? 'cadastro' : 'login')}
        >
          <Text style={styles.link}>
            {modo === 'login' ? 'Criar conta' : 'Já tenho conta'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#3788d8',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#3788d8',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});