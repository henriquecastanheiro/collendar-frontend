import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import api, { getErrorMessage } from "../../services/api";
import { CalendarStackParamList, CreateEventoDTO, Evento } from "../../types";
import { toISOString, addHours } from "../../utils/dateUtils";
import { Colors, Spacing, BorderRadius } from "../../constants/colors";
import ColorPicker from "../../components/ColorPicker";

type Props = NativeStackScreenProps<CalendarStackParamList, "CreateEvent">;

const CreateEventScreen: React.FC<Props> = ({ route, navigation }) => {
  const { calendarioId, eventoId, initialDate } = route.params;
  const isEditing = !!eventoId;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [local, setLocal] = useState("");
  const [cor, setCor] = useState(Colors.calendarColors[0]);
  const [diaInteiro, setDiaInteiro] = useState(false);
  const [recorrente, setRecorrente] = useState(false);
  const [tipoRecorrencia, setTipoRecorrencia] = useState<
    "DIARIA" | "SEMANAL" | "MENSAL" | "ANUAL"
  >("DIARIA");
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    if (initialDate) {
      const date = new Date(initialDate + "T09:00:00");
      setDataInicio(date);
      setDataFim(new Date(date.getTime() + 60 * 60 * 1000));
    }

    if (isEditing) {
      loadEvento();
    }
  }, []);

  const loadEvento = async () => {
    try {
      const response = await api.get<Evento>(`/eventos/${eventoId}`);
      const evento = response.data;

      setTitulo(evento.titulo);
      setDescricao(evento.descricao);
      setDataInicio(new Date(evento.dataInicio));
      setDataFim(new Date(evento.dataFim));
      setLocal(evento.local);
      setCor(evento.cor);
      setDiaInteiro(evento.diaInteiro);
      setRecorrente(evento.recorrente);
      if (evento.tipoRecorrencia) {
        setTipoRecorrencia(evento.tipoRecorrencia);
      }
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert("Erro", "O título é obrigatório");
      return;
    }

    if (dataFim <= dataInicio) {
      Alert.alert(
        "Erro",
        "A data de término deve ser posterior à data de início"
      );
      return;
    }

    setLoading(true);

    const eventoData: CreateEventoDTO = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      dataInicio: toISOString(dataInicio),
      dataFim: toISOString(dataFim),
      local: local.trim(),
      cor,
      diaInteiro,
      recorrente,
      tipoRecorrencia: recorrente ? tipoRecorrencia : undefined,
      calendarioId,
    };

    try {
      if (isEditing) {
        await api.put(`/eventos/${eventoId}`, eventoData);
        Alert.alert("Sucesso", "Evento atualizado com sucesso");
      } else {
        await api.post("/eventos", eventoData);
        Alert.alert("Sucesso", "Evento criado com sucesso");
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
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do evento"
            value={titulo}
            onChangeText={setTitulo}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalhes do evento"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Dia inteiro</Text>
          <Switch
            value={diaInteiro}
            onValueChange={setDiaInteiro}
            disabled={loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de início</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text>{dataInicio.toLocaleDateString("pt-BR")}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={dataInicio}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowStartDatePicker(false);
                if (date) setDataInicio(date);
              }}
            />
          )}
        </View>

        {!diaInteiro && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hora de início</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text>
                {dataInicio.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={dataInicio}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowStartTimePicker(false);
                  if (date) setDataInicio(date);
                }}
              />
            )}
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de término</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text>{dataFim.toLocaleDateString("pt-BR")}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={dataFim}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowEndDatePicker(false);
                if (date) setDataFim(date);
              }}
            />
          )}
        </View>

        {!diaInteiro && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hora de término</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text>
                {dataFim.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={dataFim}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowEndTimePicker(false);
                  if (date) setDataFim(date);
                }}
              />
            )}
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Local</Text>
          <TextInput
            style={styles.input}
            placeholder="Onde será o evento"
            value={local}
            onChangeText={setLocal}
            editable={!loading}
          />
        </View>

        <ColorPicker
          selectedColor={cor}
          onColorSelect={setCor}
          label="Cor do evento"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Evento recorrente</Text>
          <Switch
            value={recorrente}
            onValueChange={setRecorrente}
            disabled={loading}
          />
        </View>

        {recorrente && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de recorrência</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={tipoRecorrencia}
                onValueChange={setTipoRecorrencia}
                enabled={!loading}
              >
                <Picker.Item label="Diária" value="DIARIA" />
                <Picker.Item label="Semanal" value="SEMANAL" />
                <Picker.Item label="Mensal" value="MENSAL" />
                <Picker.Item label="Anual" value="ANUAL" />
              </Picker>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.card} />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? "Atualizar Evento" : "Criar Evento"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  dateButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
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
    marginTop: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateEventScreen;
