import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Input, Loading, COLORS } from "../components/Components";
import { useApp } from "../contexts/AppContext";

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, register, isLoading } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }
    if (isRegistering && !nome.trim()) {
      Alert.alert("Erro", "Preencha o nome");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await register(nome.trim(), email.trim(), senha);
      } else {
        await login(email.trim(), senha);
      }
      navigation.replace("Home");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Falha na autenticação"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loading message="Carregando..." />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>📅</Text>
        <Text style={styles.title}>Collendar</Text>
        <Text style={styles.subtitle}>Calendários compartilhados</Text>

        <View style={styles.form}>
          {isRegistering && (
            <Input
              label="Nome"
              placeholder="Seu nome"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          )}
          <Input
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            placeholder="Sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Button
            title={isRegistering ? "Criar conta" : "Entrar"}
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: 8 }}
          />
          <Button
            title={isRegistering ? "Já tenho conta" : "Criar conta"}
            variant="ghost"
            onPress={() => setIsRegistering(!isRegistering)}
            style={{ marginTop: 8 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, justifyContent: "center", padding: 24 },
  logo: { fontSize: 64, textAlign: "center", marginBottom: 16 },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    padding: 24,
  },
});

export default LoginScreen;
