import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendario } from "../types";
import { Colors, Spacing, BorderRadius } from "../constants/colors";

interface CalendarCardProps {
  calendario: Calendario;
  onPress: () => void;
  isShared?: boolean;
  permissao?: "VISUALIZAR" | "EDITAR" | null;
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  calendario,
  onPress,
  isShared = false,
  permissao,
}) => {
  const getPermissionIcon = () => {
    if (!isShared) return "person-outline";
    return permissao === "EDITAR" ? "create-outline" : "eye-outline";
  };

  const getPermissionText = () => {
    if (!isShared) return "Proprietário";
    return permissao === "EDITAR" ? "Pode editar" : "Visualização";
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.colorBar, { backgroundColor: calendario.cor }]} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {calendario.nome}
        </Text>

        {calendario.descricao ? (
          <Text style={styles.description} numberOfLines={2}>
            {calendario.descricao}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.badge}>
            <Ionicons
              name={getPermissionIcon()}
              size={14}
              color={isShared ? Colors.secondary : Colors.primary}
            />
            <Text
              style={[
                styles.badgeText,
                { color: isShared ? Colors.secondary : Colors.primary },
              ]}
            >
              {getPermissionText()}
            </Text>
          </View>

          {isShared && calendario.proprietarioNome && (
            <Text style={styles.ownerText} numberOfLines={1}>
              De: {calendario.proprietarioNome}
            </Text>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
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
    alignItems: "center",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  colorBar: {
    width: 6,
    height: "100%",
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
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ownerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: "italic",
    flex: 1,
    textAlign: "right",
  },
});

export default CalendarCard;
