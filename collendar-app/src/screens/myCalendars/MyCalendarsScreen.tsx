import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import api, { getErrorMessage } from "../../services/api";
import { MyCalendarsStackParamList, Calendario } from "../../types";
import { Colors, Spacing, BorderRadius } from "../../constants/colors";
import CalendarCard from "../../components/CalendarCard";
import LoadingScreen from "../../components/LoadingCard";

type Props = NativeStackScreenProps<
  MyCalendarsStackParamList,
  "MyCalendarsMain"
>;

const MyCalendarsScreen: React.FC<Props> = ({ navigation }) => {
  const [calendarios, setCalendarios] = useState<Calendario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCalendarios();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadCalendarios();
    });
    return unsubscribe;
  }, [navigation]);

  const loadCalendarios = async () => {
    try {
      const response = await api.get<Calendario[]>("/calendarios/meus");
      setCalendarios(response.data);
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCalendarios();
  }, []);

  const renderItem = ({ item }: { item: Calendario }) => (
    <CalendarCard
      calendario={item}
      onPress={() =>
        navigation.navigate("CalendarDetails", { calendarioId: item.id })
      }
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="folder-open-outline"
        size={64}
        color={Colors.textSecondary}
      />
      <Text style={styles.emptyText}>Você ainda não tem calendários</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateCalendar", {})}
      >
        <Text style={styles.createButtonText}>Criar primeiro calendário</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <FlatList
        data={calendarios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          calendarios.length === 0 ? styles.emptyListContainer : undefined
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {calendarios.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("CreateCalendar", {})}
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
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  createButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: "600",
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

export default MyCalendarsScreen;
