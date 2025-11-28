import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Calendar, DateData } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import api, { getErrorMessage } from "../../services/api";
import {
  CalendarStackParamList,
  Calendario,
  Evento,
  MarkedDate,
} from "../../types";
import {
  getMonthRange,
  getDateOnly,
  getTodayString,
} from "../../utils/dateUtils";
import { Colors, Spacing, BorderRadius } from "../../constants/colors";
import EventCard from "../../components/EventCard";

type Props = NativeStackScreenProps<CalendarStackParamList, "CalendarMain">;

const CalendarScreen: React.FC<Props> = ({ navigation }) => {
  const [calendarios, setCalendarios] = useState<Calendario[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<Calendario | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [markedDates, setMarkedDates] = useState<{ [key: string]: MarkedDate }>(
    {}
  );
  const [eventosDoMes, setEventosDoMes] = useState<Evento[]>([]);
  const [eventosDoDia, setEventosDoDia] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [podeEditar, setPodeEditar] = useState(false);

  useEffect(() => {
    loadCalendarios();
  }, []);

  useEffect(() => {
    if (selectedCalendar) {
      const today = new Date();
      loadEventosDoMes(today.getFullYear(), today.getMonth() + 1);
      checkPermissao();
    }
  }, [selectedCalendar]);

  useEffect(() => {
    filterEventosDoDia();
  }, [selectedDate, eventosDoMes]);

  const loadCalendarios = async () => {
    try {
      const response = await api.get<Calendario[]>("/calendarios/acessiveis");
      setCalendarios(response.data);

      if (response.data.length > 0 && !selectedCalendar) {
        setSelectedCalendar(response.data[0]);
      }
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const loadEventosDoMes = async (year: number, month: number) => {
    if (!selectedCalendar) return;

    try {
      const { dataInicio, dataFim } = getMonthRange(year, month);

      const response = await api.get<Evento[]>(
        `/eventos/calendario/${selectedCalendar.id}/periodo`,
        {
          params: { dataInicio, dataFim },
        }
      );

      setEventosDoMes(response.data);
      markDatesWithEvents(response.data);
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    }
  };

  const checkPermissao = async () => {
    if (!selectedCalendar) return;

    try {
      const response = await api.get<boolean>(
        `/calendarios/${selectedCalendar.id}/posso-editar`
      );
      setPodeEditar(response.data);
    } catch (error) {
      setPodeEditar(false);
    }
  };

  const markDatesWithEvents = (eventos: Evento[]) => {
    const marked: { [key: string]: MarkedDate } = {};

    eventos.forEach((evento) => {
      const date = getDateOnly(evento.dataInicio);

      if (!marked[date]) {
        marked[date] = { dots: [] };
      }

      marked[date].dots!.push({ color: evento.cor });
    });

    // Adicionar seleção da data atual
    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = Colors.primary + "20";
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: Colors.primary + "20",
      };
    }

    setMarkedDates(marked);
  };

  const filterEventosDoDia = () => {
    const eventos = eventosDoMes.filter(
      (evento) => getDateOnly(evento.dataInicio) === selectedDate
    );
    setEventosDoDia(eventos);
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleMonthChange = (month: DateData) => {
    loadEventosDoMes(month.year, month.month);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCalendarios();
    if (selectedCalendar) {
      const today = new Date();
      await loadEventosDoMes(today.getFullYear(), today.getMonth() + 1);
    }
    setRefreshing(false);
  }, [selectedCalendar]);

  const renderEventoItem = ({ item }: { item: Evento }) => (
    <EventCard
      evento={item}
      onPress={() => navigation.navigate("EventDetails", { eventoId: item.id })}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="calendar-outline"
        size={64}
        color={Colors.textSecondary}
      />
      <Text style={styles.emptyText}>
        {selectedCalendar
          ? "Nenhum evento neste dia"
          : "Selecione um calendário"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Seletor de Calendário */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Calendário:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedCalendar?.id}
            onValueChange={(itemValue) => {
              const calendar = calendarios.find((cal) => cal.id === itemValue);
              setSelectedCalendar(calendar || null);
            }}
            style={styles.picker}
          >
            {calendarios.map((cal) => (
              <Picker.Item key={cal.id} label={cal.nome} value={cal.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Calendário Mensal */}
      {selectedCalendar && (
        <Calendar
          current={selectedDate}
          markedDates={markedDates}
          markingType="multi-dot"
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          theme={{
            backgroundColor: Colors.background,
            calendarBackground: Colors.card,
            textSectionTitleColor: Colors.textSecondary,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: Colors.card,
            todayTextColor: Colors.primary,
            dayTextColor: Colors.text,
            textDisabledColor: Colors.border,
            dotColor: Colors.primary,
            selectedDotColor: Colors.card,
            arrowColor: Colors.primary,
            monthTextColor: Colors.text,
            textMonthFontWeight: "bold",
            textDayFontSize: 16,
            textMonthFontSize: 18,
          }}
        />
      )}

      {/* Lista de Eventos do Dia */}
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>
          Eventos de{" "}
          {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}
        </Text>
      </View>

      <FlatList
        data={eventosDoDia}
        renderItem={renderEventoItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={
          eventosDoDia.length === 0 ? styles.emptyListContainer : undefined
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Botão Flutuante para Criar Evento */}
      {podeEditar && selectedCalendar && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            navigation.navigate("CreateEvent", {
              calendarioId: selectedCalendar.id,
              initialDate: selectedDate,
            })
          }
        >
          <Ionicons name="add" size={28} color={Colors.card} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  pickerContainer: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  eventsHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  fab: {
    position: "absolute",
    right: Spacing.md,
    bottom: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default CalendarScreen;
