import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Evento } from "../types";
import { formatTime } from "../utils/dateUtils";
import { Colors, Spacing, BorderRadius } from "../constants/colors";

interface EventCardProps {
  evento: Evento;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ evento, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.colorBar, { backgroundColor: evento.cor }]} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {evento.titulo}
        </Text>

        {evento.descricao ? (
          <Text style={styles.description} numberOfLines={2}>
            {evento.descricao}
          </Text>
        ) : null}

        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Ionicons
              name="time-outline"
              size={14}
              color={Colors.textSecondary}
            />
            <Text style={styles.detailText}>
              {evento.diaInteiro
                ? "Dia inteiro"
                : `${formatTime(evento.dataInicio)} - ${formatTime(
                    evento.dataFim
                  )}`}
            </Text>
          </View>

          {evento.local ? (
            <View style={styles.detail}>
              <Ionicons
                name="location-outline"
                size={14}
                color={Colors.textSecondary}
              />
              <Text style={styles.detailText} numberOfLines={1}>
                {evento.local}
              </Text>
            </View>
          ) : null}
        </View>

        {evento.recorrente && (
          <View style={styles.badge}>
            <Ionicons name="repeat-outline" size={12} color={Colors.primary} />
            <Text style={styles.badgeText}>Recorrente</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    flex: 1,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },
});

export default EventCard;
