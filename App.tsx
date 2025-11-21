import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CalendarioScreen } from './screens/CalendarioScreen';
import { restaurarSessao, logout } from './utils/api';
import type { Usuario, Calendario } from './types';

export default function App() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [calendarioAtual, setCalendarioAtual] = useState<Calendario | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sessão ao iniciar
  useEffect(() => {
    (async () => {
      const usuario = await restaurarSessao();
      if (usuario) {
        setUser(usuario);
      }
      setLoading(false);
    })();
  }, []);

  // Handlers
  const handleLogin = (usuario: Usuario) => {
    setUser(usuario);
  };

  const handleLogout = () => {
    setUser(null);
    setCalendarioAtual(null);
  };

  const abrirCalendario = (calendario: Calendario) => {
    setCalendarioAtual(calendario);
  };

  const voltarParaHome = () => {
    setCalendarioAtual(null);
  };

  // Loading inicial
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3788d8" />
      </View>
    );
  }

  // Não autenticado - mostra login
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Autenticado - mostra home ou calendário
  if (calendarioAtual) {
    return (
      <CalendarioScreen
        calendario={calendarioAtual}
        onVoltar={voltarParaHome}
      />
    );
  }

  return (
    <HomeScreen
      user={user}
      onLogout={handleLogout}
      onAbrirCalendario={abrirCalendario}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});