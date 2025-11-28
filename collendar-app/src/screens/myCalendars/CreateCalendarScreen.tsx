import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import api, { getErrorMessage } from "../../services/api";
import {
  MyCalendarsStackParamList,
  CreateCalendarioDTO,
  Calendario,
} from "../../types";
import { Colors, Spacing, BorderRadius } from "../../constants/colors";
import ColorPicker from "../../components/ColorPicker";

type Props = NativeStackScreenProps<
  MyCalendarsStackParamList,
  "CreateCalendar"
>;

const CreateCalendarScreen: React.FC<Props> = ({ route, navigation }) => {
  const { calendarioId } = route.params;
  const isEditing = !!calendarioId;
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cor, setCor] = useState(Colors.calendarColors[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) loadCalendario();
  }, []);

  const loadCalendario = async () => {
    try {
      const response = await api.get<Calendario>(
        `/calendarios/${calendarioId}`
      );
      setNome(response.data.nome);
      setDescricao(response.data.descricao);
      setCor(response.data.cor);
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O nome é obrigatório");
      return;
    }
    setLoading(true);
    const data: CreateCalendarioDTO = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      cor,
    };
    try {
      if (isEditing) {
        await api.put(`/calendarios/${calendarioId}`, data);
        Alert.alert("Sucesso", "Calendário atualizado");
      } else {
        await api.post("/calendarios", data);
        Alert.alert("Sucesso", "Calendário criado");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome do Calendário *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Trabalho, Pessoal"
            value={nome}
            onChangeText={setNome}
            editable={!loading}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição (opcional)"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>
        <ColorPicker
          selectedColor={cor}
          onColorSelect={setCor}
          label="Cor do Calendário"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.card} />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? "Atualizar" : "Criar"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  inputContainer: { marginBottom: Spacing.md },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Colors.card, fontSize: 16, fontWeight: "600" },
});

export default CreateCalendarScreen;
