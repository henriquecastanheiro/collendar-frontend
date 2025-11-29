import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input, ColorPicker, COLORS } from "../components/Components";
import { useApp } from "../contexts/AppContext";

const CreateEventScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { calendarioAtivo, createEvento } = useApp();
  const initialDate = route.params?.date
    ? new Date(route.params.date)
    : new Date();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [cor, setCor] = useState(calendarioAtivo?.cor || "#8B5CF6");
  const [diaInteiro, setDiaInteiro] = useState(false);
  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date(initialDate);
    d.setHours(9, 0);
    return d;
  });
  const [dataFim, setDataFim] = useState(() => {
    const d = new Date(initialDate);
    d.setHours(10, 0);
    return d;
  });
  const [showPicker, setShowPicker] = useState<
    "dateStart" | "timeStart" | "dateEnd" | "timeEnd" | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!titulo.trim()) {
      Alert.alert("Erro", "Digite um título");
      return;
    }
    if (!calendarioAtivo) {
      Alert.alert("Erro", "Selecione um calendário");
      return;
    }
    if (dataFim <= dataInicio) {
      Alert.alert("Erro", "Data fim deve ser maior");
      return;
    }

    setLoading(true);
    try {
      await createEvento({
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        local: local.trim() || undefined,
        cor,
        diaInteiro,
        dataInicio: dataInicio.toISOString().slice(0, 19),
        dataFim: dataFim.toISOString().slice(0, 19),
        calendarioId: calendarioAtivo.id,
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Falha ao criar");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: Date) => d.toLocaleDateString("pt-BR");
  const formatTime = (d: Date) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const handlePickerChange = (event: any, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowPicker(null);
      return;
    }

    if (showPicker === "dateStart") {
      const newDate = new Date(dataInicio);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDataInicio(newDate);
      if (dataFim <= newDate) setDataFim(new Date(newDate.getTime() + 3600000));
    } else if (showPicker === "timeStart") {
      const newDate = new Date(dataInicio);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setDataInicio(newDate);
      if (dataFim <= newDate) setDataFim(new Date(newDate.getTime() + 3600000));
    } else if (showPicker === "dateEnd") {
      const newDate = new Date(dataFim);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDataFim(newDate);
    } else if (showPicker === "timeEnd") {
      const newDate = new Date(dataFim);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setDataFim(newDate);
    }
    setShowPicker(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <Input
          label="Título *"
          placeholder="Nome do evento"
          value={titulo}
          onChangeText={setTitulo}
        />
        <Input
          label="Descrição"
          placeholder="Detalhes"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />
        <Input
          label="Local"
          placeholder="Onde será"
          value={local}
          onChangeText={setLocal}
        />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dia inteiro</Text>
          <Switch
            value={diaInteiro}
            onValueChange={setDiaInteiro}
            trackColor={{ false: COLORS.surface, true: COLORS.primary }}
          />
        </View>

        <Text style={styles.label}>Início</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowPicker("dateStart")}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.primary}
            />
            <Text style={styles.dateBtnText}>{formatDate(dataInicio)}</Text>
          </TouchableOpacity>
          {!diaInteiro && (
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowPicker("timeStart")}
            >
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              <Text style={styles.dateBtnText}>{formatTime(dataInicio)}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>Fim</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowPicker("dateEnd")}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.primary}
            />
            <Text style={styles.dateBtnText}>{formatDate(dataFim)}</Text>
          </TouchableOpacity>
          {!diaInteiro && (
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowPicker("timeEnd")}
            >
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              <Text style={styles.dateBtnText}>{formatTime(dataFim)}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>Cor</Text>
        <ColorPicker selected={cor} onSelect={setCor} />
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

      {showPicker && (
        <DateTimePicker
          value={showPicker.includes("Start") ? dataInicio : dataFim}
          mode={showPicker.includes("date") ? "date" : "time"}
          onChange={handlePickerChange}
        />
      )}
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
    marginTop: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLabel: { color: COLORS.text, fontSize: 16 },
  dateRow: { flexDirection: "row", gap: 10 },
  dateBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  dateBtnText: { color: COLORS.text, fontSize: 14 },
  actions: { flexDirection: "row" },
});

export default CreateEventScreen;
