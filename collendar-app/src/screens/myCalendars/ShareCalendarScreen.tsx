import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import api, { getErrorMessage } from "../../services/api";
import { SharedStackParamList, Compartilhamento } from "../../types";
import { Colors, Spacing } from "../../constants/colors";
import CalendarCard from "../../components/CalendarCard";
import LoadingScreen from "../../components/LoadingCard";

type Props = NativeStackScreenProps<
  SharedStackParamList,
  "SharedCalendarsMain"
>;

const SharedCalendarsScreen: React.FC<Props> = () => {
  const [compartilhamentos, setCompartilhamentos] = useState<
    Compartilhamento[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCompartilhamentos();
  }, []);

  const loadCompartilhamentos = async () => {
    try {
      const response = await api.get<Compartilhamento[]>(
        "/compartilhamentos/recebidos/detalhes" // ✅ Usar endpoint com detalhes
      );
      setCompartilhamentos(response.data);
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCompartilhamentos();
  }, []);

  const renderItem = ({ item }: { item: Compartilhamento }) => (
    <CalendarCard
      calendario={{
        id: item.calendarioId,
        nome: item.calendarioNome,
        descricao: "",
        cor: "#6366F1",
        usuarioId: item.usuarioId, // ✅ CORRIGIDO
        usuarioNome: item.usuarioNome, // ✅ CORRIGIDO
      }}
      onPress={() => {}}
      isShared
      permissao={item.permissao}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyText}>Nenhum calendário compartilhado</Text>
    </View>
  );

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <FlatList
        data={compartilhamentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          compartilhamentos.length === 0 ? styles.emptyListContainer : undefined
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  emptyListContainer: { flexGrow: 1 },
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
    textAlign: "center",
  },
});

export default SharedCalendarsScreen;
