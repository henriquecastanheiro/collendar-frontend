import React, { useState, useEffect } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { calendarioService } from "../api/calendarioService";
import { Calendario } from "../types";
import { SafeAreaView } from "react-native";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { CalendarioCard } from "../components/CalendarioCard";
import { StyleSheet } from "react-native";

export const HomeScreen = ({ onSelectCalendario, onCreateCalendario }: any) => {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"meus" | "compartilhados">("meus");
  const [meusCalendarios, setMeusCalendarios] = useState<Calendario[]>([]);
  const [calendariosCompartilhados, setCalendariosCompartilhados] = useState<
    Calendario[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Escolhe a lista de calendários a partir da tab ativa
  const calendarios =
    activeTab === "meus" ? meusCalendarios : calendariosCompartilhados;

  useEffect(() => {
    loadCalendarios();
  }, [activeTab, user, token]);

  const loadCalendarios = async () => {
    if (!user || !token) return;

    setLoading(true);
    try {
      if (activeTab === "meus") {
        const cals = await calendarioService.listarMeusCalendarios(
          user.id,
          token
        );
        setMeusCalendarios(cals);
      } else {
        const cals = await calendarioService.listarCalendariosCompartilhados(
          user.id,
          token
        );
        setCalendariosCompartilhados(cals);
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao carregar calendários");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          {/* Protege caso user seja undefined */}
          <Text style={styles.greeting}>
            Olá, {user && user.nome ? user.nome.split(" ")[0] : "Usuário"}!
          </Text>
          <Text style={styles.subtitle}>
            {activeTab === "meus"
              ? "Seus calendários"
              : "Compartilhados com você"}
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* TAB NAVIGATION */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "meus" && styles.activeTab]}
          onPress={() => setActiveTab("meus")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "meus" && styles.activeTabText,
            ]}
          >
            📅 Meus Calendários
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "compartilhados" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("compartilhados")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "compartilhados" && styles.activeTabText,
            ]}
          >
            👥 Compartilhados
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <LoadingSpinner />
        ) : calendarios.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              {activeTab === "meus" ? "📅" : "👥"}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === "meus"
                ? "Nenhum calendário criado"
                : "Nenhum calendário compartilhado com você"}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {calendarios.map((c) => (
              <CalendarioCard
                key={c.id}
                calendario={c}
                onPress={() => onSelectCalendario(c)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB - Só aparece na tab "Meus Calendários" */}
      {activeTab === "meus" && (
        <TouchableOpacity style={styles.fab} onPress={onCreateCalendario}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    fontSize: 24,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#3788d8",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3788d8",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 80,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: "#3788d8",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
  },
});
