import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { Button, Input, ColorPicker, COLORS } from "../components/Components";
import { useApp } from "../contexts/AppContext";

const CreateCalendarScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { createCalendario } = useApp();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cor, setCor] = useState("#6366F1");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "Digite um nome");
      return;
    }
    setLoading(true);
    try {
      await createCalendario(nome.trim(), descricao.trim() || undefined, cor);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Falha ao criar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <Input
          label="Nome *"
          placeholder="Ex: Trabalho, Pessoal..."
          value={nome}
          onChangeText={setNome}
        />
        <Input
          label="Descrição"
          placeholder="Opcional"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <Text style={styles.label}>Cor</Text>
        <ColorPicker selected={cor} onSelect={setCor} />

        <View style={[styles.preview, { backgroundColor: cor }]}>
          <Text style={styles.previewText}>{nome || "Novo Calendário"}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Cancelar"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={{ flex: 1 }}
        />
        <Button
          title="Criar"
          onPress={handleCreate}
          loading={loading}
          style={{ flex: 2, marginLeft: 12 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  form: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  },
  preview: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  previewText: { color: COLORS.white, fontWeight: "600", fontSize: 16 },
  actions: { flexDirection: "row" },
});

export default CreateCalendarScreen;
