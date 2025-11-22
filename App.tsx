import React, { useState } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CalendarioDetailScreen } from './src/screens/CalendarioDetailScreen';
import { CalendarioFormScreen } from './src/screens/CalendarioFormScreen';
import { EventoFormScreen } from './src/screens/EventoFormScreen';
import type { Usuario, Calendario, Evento } from './src/types';

type Screen = 'login' | 'register' | 'home' | 'calendarioDetail' | 'calendarioForm' | 'eventoForm';

function Navigation() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [screen, setScreen] = useState<Screen>('login');
  const [selectedCalendario, setSelectedCalendario] = useState<Calendario | null>(null);
  const [editingCalendario, setEditingCalendario] = useState<Calendario | null>(null);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);

  const navigate = (newScreen: Screen, data: any = null) => {
    setScreen(newScreen);
    if (newScreen === 'calendarioDetail') setSelectedCalendario(data);
    if (newScreen === 'calendarioForm') setEditingCalendario(data);
    if (newScreen === 'eventoForm') setEditingEvento(data);
  };

  // Não autenticado
  if (!user) {
    if (screen === 'register') {
      return <RegisterScreen onRegister={() => {}} onGoToLogin={() => setScreen('login')} />;
    }
    return <LoginScreen onLogin={setUser} onGoToRegister={() => setScreen('register')} />;
  }

  // Autenticado
  switch (screen) {
    case 'calendarioDetail':
      return (
        <CalendarioDetailScreen
          calendario={selectedCalendario!}
          onBack={() => navigate('home')}
          onEdit={(c) => navigate('calendarioForm', c)}
          onCreateEvento={() => navigate('eventoForm')}
          onEditEvento={(e) => navigate('eventoForm', e)}
        />
      );
    case 'calendarioForm':
      return (
        <CalendarioFormScreen
          calendario={editingCalendario}
          onSave={() => navigate('home')}
          onCancel={() => navigate('home')}
        />
      );
    case 'eventoForm':
      return (
        <EventoFormScreen
          evento={editingEvento}
          calendarioId={selectedCalendario?.id || ''}
          onSave={() => navigate('calendarioDetail', selectedCalendario)}
          onCancel={() => navigate('calendarioDetail', selectedCalendario)}
        />
      );
    default:
      return (
        <HomeScreen
          user={user}
          onLogout={() => {
            setUser(null);
            setScreen('login');
          }}
          onSelectCalendario={(c) => navigate('calendarioDetail', c)}
          onCreateCalendario={() => navigate('calendarioForm')}
        />
      );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
