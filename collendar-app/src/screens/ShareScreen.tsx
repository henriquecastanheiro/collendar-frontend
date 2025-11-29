import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input, COLORS } from "../components/Components";
import { useApp } from "../contexts/AppContext";

const ShareScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    calendarioAtivo,
    compartilhamentos,
    loadCompartilhamentos,
    compartilhar,
    removerCompartilhamento,
  } = useApp();

  const [email, setEmail] = useState("");
  const [permissao, setPermissao] = useState<"VISUALIZAR" | "EDITAR">(
    "VISUALIZAR"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompartilhamentos();
  }, []);

  const handleShare = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Digite um email");
      return;
    }
    setLoading(true);
    try {
      await compartilhar(email.trim(), permissao);
      setEmail("");
      Alert.alert("Sucesso", "Calendário compartilhado!");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Falha ao compartilhar"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: string, nome: string) => {
    Alert.alert("Remover", `Remover acesso de ${nome}?`, [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: () => removerCompartilhamento(id),
      },
    ]);
  };

  if (!calendarioAtivo) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Selecione um calendário primeiro</Text>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Calendário Info */}
      <View style={[styles.calInfo, { borderLeftColor: calendarioAtivo.cor }]}>
        <Text style={styles.calName}>{calendarioAtivo.nome}</Text>
        <Text style={styles.calDesc}>
          {calendarioAtivo.descricao || "Sem descrição"}
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Compartilhar com</Text>
        <Input
          placeholder="Email do destinatário"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Permissão</Text>
        <View style={styles.permRow}>
          <TouchableOpacity
            style={[
              styles.permBtn,
              permissao === "VISUALIZAR" && styles.permBtnActive,
            ]}
            onPress={() => setPermissao("VISUALIZAR")}
          >
            <Ionicons
              name="eye-outline"
              size={18}
              color={
                permissao === "VISUALIZAR" ? COLORS.white : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.permText,
                permissao === "VISUALIZAR" && styles.permTextActive,
              ]}
            >
              Visualizar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.permBtn,
              permissao === "EDITAR" && styles.permBtnActive,
            ]}
            onPress={() => setPermissao("EDITAR")}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={
                permissao === "EDITAR" ? COLORS.white : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.permText,
                permissao === "EDITAR" && styles.permTextActive,
              ]}
            >
              Editar
            </Text>
          </TouchableOpacity>
        </View>

        <Button title="Compartilhar" onPress={handleShare} loading={loading} />
      </View>

      {/* Lista */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>
          Compartilhado com ({compartilhamentos.length})
        </Text>
        <FlatList
          data={compartilhamentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color={COLORS.white} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.usuarioNome}</Text>
                <Text style={styles.itemEmail}>{item.usuarioEmail}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  item.permissao === "EDITAR" && styles.badgeEdit,
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.permissao === "EDITAR" ? "Editar" : "Ver"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemove(item.id, item.usuarioNome)}
              >
                <Ionicons name="close" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Ionicons
                name="people-outline"
                size={40}
                color={COLORS.textMuted}
              />
              <Text style={styles.emptyListText}>Nenhum compartilhamento</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: { color: COLORS.textSecondary, fontSize: 16 },
  calInfo: {
    backgroundColor: COLORS.backgroundLight,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  calName: { color: COLORS.text, fontSize: 18, fontWeight: "600" },
  calDesc: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  form: {
    backgroundColor: COLORS.backgroundLight,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  label: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 8 },
  permRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  permBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    gap: 6,
  },
  permBtnActive: { backgroundColor: COLORS.primary },
  permText: { color: COLORS.textSecondary, fontSize: 14 },
  permTextActive: { color: COLORS.white },
  listSection: { flex: 1, padding: 16 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: { flex: 1, marginLeft: 10 },
  itemName: { color: COLORS.text, fontWeight: "500" },
  itemEmail: { color: COLORS.textSecondary, fontSize: 12 },
  badge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  badgeEdit: { backgroundColor: COLORS.success + "30" },
  badgeText: { color: COLORS.text, fontSize: 12 },
  emptyList: { alignItems: "center", paddingVertical: 32 },
  emptyListText: { color: COLORS.textMuted, marginTop: 8 },
});

export default ShareScreen;
