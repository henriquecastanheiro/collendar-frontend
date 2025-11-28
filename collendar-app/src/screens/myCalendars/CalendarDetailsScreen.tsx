import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import api, { getErrorMessage } from "../../services/api";
import {
  MyCalendarsStackParamList,
  Calendario,
  Compartilhamento,
} from "../../types";
import { Colors, Spacing, BorderRadius } from "../../constants/colors";
import LoadingScreen from "../../components/LoadingCard";

type Props = NativeStackScreenProps<
  MyCalendarsStackParamList,
  "CalendarDetails"
>;

const CalendarDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { calendarioId } = route.params;
  const [calendario, setCalendario] = useState<Calendario | null>(null);
  const [compartilhamentos, setCompartilhamentos] = useState<
    Compartilhamento[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const [calResponse, compResponse] = await Promise.all([
        api.get<Calendario>(`/calendarios/${calendarioId}`),
        api.get<Compartilhamento[]>(
          `/compartilhamentos/calendario/${calendarioId}`
        ),
      ]);
      setCalendario(calResponse.data);
      setCompartilhamentos(compResponse.data);
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Confirmar exclusão", "Todos os eventos serão excluídos.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/calendarios/${calendarioId}`);
            Alert.alert("Sucesso", "Calendário excluído");
            navigation.goBack();
          } catch (error) {
            Alert.alert("Erro", getErrorMessage(error));
          }
        },
      },
    ]);
  };

  const handleRemoveShare = (compId: string) => {
    Alert.alert("Remover acesso", "Deseja remover o acesso?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/compartilhamentos/${compId}`);
            loadData();
          } catch (error) {
            Alert.alert("Erro", getErrorMessage(error));
          }
        },
      },
    ]);
  };

  const renderShareItem = ({ item }: { item: Compartilhamento }) => (
    <View style={styles.shareItem}>
      <View style={styles.shareInfo}>
        <Text style={styles.shareName}>{item.destinatarioNome}</Text>
        <Text style={styles.shareEmail}>{item.destinatarioEmail}</Text>
        <Text style={styles.sharePermission}>
          {item.permissao === "EDITAR" ? "Pode editar" : "Visualização"}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveShare(item.id)}>
        <Ionicons name="trash-outline" size={20} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );

  if (loading) return <LoadingScreen />;
  if (!calendario) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.colorHeader, { backgroundColor: calendario.cor }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{calendario.nome}</Text>
        {calendario.descricao ? (
          <Text style={styles.description}>{calendario.descricao}</Text>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() =>
              navigation.navigate("CreateCalendar", { calendarioId })
            }
          >
            <Ionicons name="create-outline" size={20} color={Colors.card} />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={() =>
              navigation.navigate("ShareCalendar", { calendarioId })
            }
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={Colors.card}
            />
            <Text style={styles.buttonText}>Compartilhar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color={Colors.card} />
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Compartilhado com ({compartilhamentos.length})
          </Text>
          {compartilhamentos.length > 0 ? (
            <FlatList
              data={compartilhamentos}
              renderItem={renderShareItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>Ainda não compartilhado</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  colorHeader: { height: 100 },
  content: {
    marginTop: -20,
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: "uppercase",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  editButton: { backgroundColor: Colors.primary },
  shareButton: { backgroundColor: Colors.secondary },
  deleteButton: { backgroundColor: Colors.error },
  buttonText: { color: Colors.card, fontSize: 16, fontWeight: "600" },
  shareItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  shareInfo: { flex: 1 },
  shareName: { fontSize: 16, fontWeight: "600", color: Colors.text },
  shareEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  sharePermission: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: Spacing.xs,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingVertical: Spacing.md,
  },
});

export default CalendarDetailsScreen;
