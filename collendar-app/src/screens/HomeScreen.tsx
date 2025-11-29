import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  CalendarHeader,
  CalendarGrid,
  CalendarSelector,
  EventCard,
  FAB,
  COLORS,
} from "../components/Components";
import { useApp } from "../contexts/AppContext";
import { Evento } from "../services/api";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    calendarioAtivo,
    eventos,
    loadCalendarios,
    loadEventos,
    deleteEvento,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventosExibidos, setEventosExibidos] = useState<Evento[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCalendarios();
    }, [])
  );

  useEffect(() => {
    if (calendarioAtivo) {
      loadEventos();
    }
  }, [calendarioAtivo]);

  useEffect(() => {
    setEventosExibidos(
      selectedDate
        ? eventos.filter((e) => {
            const inicio = new Date(e.dataInicio);
            return inicio.toDateString() === selectedDate.toDateString();
          })
        : eventos
    );
  }, [selectedDate, eventos]);

  const handleDayPress = (date: Date, eventosNoDia: Evento[]) => {
    setSelectedDate(date);
    setEventosExibidos(eventosNoDia);
  };

  const handleDelete = (evento: Evento) => {
    Alert.alert("Excluir", `Excluir "${evento.titulo}"?`, [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: () => deleteEvento(evento.id),
      },
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCalendarios();
    await loadEventos();
    setRefreshing(false);
  };

  const handleCreateEvent = () => {
    if (!calendarioAtivo) {
      Alert.alert("Atenção", "Crie um calendário primeiro", [
        { text: "OK", onPress: () => navigation.navigate("CreateCalendar") },
      ]);
      return;
    }
    navigation.navigate("CreateEvent", { date: selectedDate?.toISOString() });
  };

  const formatDate = (date: Date) => date.toLocaleDateString("pt-BR");

  return (
    <View style={styles.container}>
      <CalendarSelector
        onCreatePress={() => navigation.navigate("CreateCalendar")}
      />

      <FlatList
        data={eventosExibidos}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <CalendarHeader />
            <CalendarGrid onDayPress={handleDayPress} />
            <View style={styles.eventsHeader}>
              <Text style={styles.eventsTitle}>
                {selectedDate
                  ? `Eventos - ${formatDate(selectedDate)}`
                  : "Todos os eventos"}
              </Text>
              <Text style={styles.eventsCount}>
                {eventosExibidos.length} evento(s)
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <EventCard
            evento={item}
            onPress={() => navigation.navigate("EditEvent", { evento: item })}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {selectedDate
                ? "Nenhum evento neste dia"
                : "Nenhum evento este mês"}
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      <FAB onPress={handleCreateEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  eventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  eventsTitle: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  eventsCount: { color: COLORS.textSecondary, fontSize: 14 },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { color: COLORS.textMuted, fontSize: 14 },
});

export default HomeScreen;
