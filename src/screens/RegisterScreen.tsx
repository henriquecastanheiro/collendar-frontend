import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface RegisterScreenProps {
  onRegister: () => void;
  onGoToLogin: () => void;
}

export const RegisterScreen = ({ onRegister, onGoToLogin }: RegisterScreenProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = () => {
    if (!nome || !email || !senha) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(onGoToLogin, 1500);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastre-se no Collendar</Text>
        </View>

        {success && (
          <View style={styles.success}>
            <Text style={styles.successText}>✅ Conta criada! Redirecionando...</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
          />
          <Input
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••"
            secureTextEntry
          />
          <Button onPress={handleRegister} disabled={loading}>
            {loading ? 'Criando...' : 'Criar Conta'}
          </Button>

          <TouchableOpacity onPress={onGoToLogin} style={styles.link}>
            <Text style={styles.linkText}>
              Já tem conta? <Text style={styles.linkBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3788d8'
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24
  },
  success: {
    backgroundColor: '#d1fae5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  successText: {
    color: '#065f46',
    fontSize: 14,
    textAlign: 'center'
  },
  link: {
    marginTop: 16,
    alignItems: 'center'
  },
  linkText: {
    fontSize: 14,
    color: '#6b7280'
  },
  linkBold: {
    color: '#3788d8',
    fontWeight: '600'
  }
});