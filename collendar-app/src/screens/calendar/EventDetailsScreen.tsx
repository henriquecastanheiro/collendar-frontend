import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import api, { getErrorMessage } from "../../services/api";
import { CalendarStackParamList, Evento } from "../../types";
import { formatDateTime, formatDate, formatTime } from "../../utils/dateUtils";
import { Colors, Spacing, BorderRadius } from "../../constants/colors";
import LoadingScreen from "../../components/LoadingCard";

type Props = NativeStackScreenProps<CalendarStackParamList, "EventDetails">;

const EventDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventoId } = route.params;
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [podeEditar, setPodeEditar] = useState(false);

  useEffect(() => {
    loadEvento();
  }, [eventoId]);

  const loadEvento = async () => {
    try {
      const [eventoResponse, permissaoResponse] = await Promise.all([
        api.get<Evento>(`/eventos/${eventoId}`),
        api
          .get<Evento>(`/eventos/${eventoId}`)
          .then((res) =>
            api.get(`/calendarios/${res.data.calendarioId}/posso-editar`)
          ),
      ]);

      setEvento(eventoResponse.data);
      setPodeEditar(
        permissaoResponse.data === true || permissaoResponse.data === "true"
      );
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/eventos/${eventoId}`);
              Alert.alert("Sucesso", "Evento excluído com sucesso");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Erro", getErrorMessage(error));
            }
          },
        },
      ]
    );
  };

  if (loading) return <LoadingScreen />;
  if (!evento) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.colorHeader, { backgroundColor: evento.cor }]} />

      <View style={styles.content}>
        <Text style={styles.title}>{evento.titulo}</Text>

        {evento.descricao ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{evento.descricao}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Colors.primary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Data</Text>
              <Text style={styles.infoValue}>
                {formatDate(evento.dataInicio)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Horário</Text>
              <Text style={styles.infoValue}>
                {evento.diaInteiro
                  ? "Dia inteiro"
                  : `${formatTime(evento.dataInicio)} - ${formatTime(
                      evento.dataFim
                    )}`}
              </Text>
            </View>
          </View>

          {evento.local ? (
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={20}
                color={Colors.primary}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Local</Text>
                <Text style={styles.infoValue}>{evento.local}</Text>
              </View>
            </View>
          ) : null}

          {evento.recorrente && (
            <View style={styles.infoRow}>
              <Ionicons
                name="repeat-outline"
                size={20}
                color={Colors.primary}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Recorrência</Text>
                <Text style={styles.infoValue}>
                  {evento.tipoRecorrencia?.toLowerCase()}
                </Text>
              </View>
            </View>
          )}
        </View>

        {podeEditar && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() =>
                navigation.navigate("CreateEvent", {
                  calendarioId: evento.calendarioId,
                  eventoId: evento.id,
                })
              }
            >
              <Ionicons name="create-outline" size={20} color={Colors.card} />
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.card} />
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  colorHeader: {
    height: 120,
  },
  content: {
    marginTop: -30,
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  infoContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  editButton: {
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  buttonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EventDetailsScreen;
