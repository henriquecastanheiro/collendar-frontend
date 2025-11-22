import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { authService } from "../api/authService";
import type { Usuario } from "../types";

interface LoginScreenProps {
  onLogin: (user: Usuario, token: string) => void;
  onGoToRegister: () => void;
}

export const LoginScreen = ({ onLogin, onGoToRegister }: LoginScreenProps) => {
  const [email, setEmail] = useState("joao@email.com");
  const [senha, setSenha] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { token, usuario } = await authService.login(email, senha);
      onLogin(usuario, token);
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
      Alert.alert("Erro", err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>📅</Text>
          </View>
          <Text style={styles.title}>Collendar</Text>
          <Text style={styles.subtitle}>Calendário Compartilhado</Text>
        </View>

        {error ? (
          <View style={styles.error}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
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
          <Button onPress={handleLogin} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <TouchableOpacity onPress={onGoToRegister} style={styles.link}>
            <Text style={styles.linkText}>
              Não tem conta? <Text style={styles.linkBold}>Criar conta</Text>
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
    backgroundColor: "#3788d8",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  error: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
  },
  link: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#6b7280",
  },
  linkBold: {
    color: "#3788d8",
    fontWeight: "600",
  },
});
