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

interface RegisterScreenProps {
  onRegister: () => void;
  onGoToLogin: () => void;
}

export const RegisterScreen = ({
  onRegister,
  onGoToLogin,
}: RegisterScreenProps) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validar nome
    if (!nome || nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email inválido";
    }

    // Validar senha
    if (!senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (senha.length < 6) {
      newErrors.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    // Validar confirmação de senha
    if (!confirmarSenha) {
      newErrors.confirmarSenha = "Confirme sua senha";
    } else if (senha !== confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Chamar API para criar usuário
      await authService.register(
        nome.trim(),
        email.trim().toLowerCase(),
        senha
      );

      // Mostrar mensagem de sucesso
      Alert.alert(
        "Sucesso!",
        "Conta criada com sucesso! Faça login para continuar.",
        [
          {
            text: "OK",
            onPress: onGoToLogin,
          },
        ]
      );
    } catch (error: any) {
      console.error("Erro ao registrar:", error);

      // Preferir a mensagem retornada pelo servidor quando disponível
      const serverMessage = error?.message;
      let errorMessage =
        serverMessage || "Erro ao criar conta. Tente novamente.";

      // Normalizar mensagem amigável para caso de email duplicado
      if (
        errorMessage.toLowerCase().includes("já cadastrado") ||
        errorMessage.toLowerCase().includes("already")
      ) {
        errorMessage = "Este email já está cadastrado. Tente fazer login.";
      }

      Alert.alert("Erro", errorMessage);
      setErrors({ geral: errorMessage });
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
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastre-se no Collendar</Text>
        </View>

        {errors.geral && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ {errors.geral}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View>
            <Input
              label="Nome completo"
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: João Silva"
            />
            {errors.nome && (
              <Text style={styles.errorFieldText}>{errors.nome}</Text>
            )}
          </View>

          <View>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={styles.errorFieldText}>{errors.email}</Text>
            )}
          </View>

          <View>
            <Input
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
            />
            {errors.senha && (
              <Text style={styles.errorFieldText}>{errors.senha}</Text>
            )}
          </View>

          <View>
            <Input
              label="Confirmar senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Digite a senha novamente"
              secureTextEntry
            />
            {errors.confirmarSenha && (
              <Text style={styles.errorFieldText}>{errors.confirmarSenha}</Text>
            )}
          </View>

          <Button
            onPress={handleRegister}
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
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
    backgroundColor: "#3788d8",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
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
  errorBox: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
  },
  errorFieldText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 4,
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
