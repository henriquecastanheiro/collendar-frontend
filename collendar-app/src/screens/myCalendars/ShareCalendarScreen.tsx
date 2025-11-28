import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import api, { getErrorMessage } from "../../services/api";
import {
  MyCalendarsStackParamList,
  CreateCompartilhamentoDTO,
} from "../../types";
import { Colors, Spacing, BorderRadius } from "../../constants/colors";

type Props = NativeStackScreenProps<MyCalendarsStackParamList, "ShareCalendar">;

const ShareCalendarScreen: React.FC<Props> = ({ route, navigation }) => {
  const { calendarioId } = route.params;
  const [email, setEmail] = useState("");
  const [permissao, setPermissao] = useState<"VISUALIZAR" | "EDITAR">(
    "VISUALIZAR"
  );
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Erro", "Email inválido");
      return;
    }
    setLoading(true);
    const data: CreateCompartilhamentoDTO = {
      calendarioId,
      emailDestinatario: email.trim(),
      permissao,
    };
    try {
      await api.post("/compartilhamentos", data);
      Alert.alert("Sucesso", "Calendário compartilhado!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Email do usuário</Text>
        <TextInput
          style={styles.input}
          placeholder="usuario@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <Text style={styles.label}>Permissão</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={permissao}
            onValueChange={setPermissao}
            enabled={!loading}
          >
            <Picker.Item label="Visualização" value="VISUALIZAR" />
            <Picker.Item label="Edição" value="EDITAR" />
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleShare}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.card} />
          ) : (
            <Text style={styles.buttonText}>Compartilhar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    overflow: "hidden",
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Colors.card, fontSize: 16, fontWeight: "600" },
});

export default ShareCalendarScreen;
