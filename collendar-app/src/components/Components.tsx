import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../contexts/AppContext";
import { Evento, Calendario } from "../services/api";

// ========== CORES ==========
export const COLORS = {
  primary: "#6366F1",
  background: "#0F172A",
  backgroundLight: "#1E293B",
  surface: "#334155",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  border: "#475569",
  error: "#EF4444",
  success: "#10B981",
  white: "#FFFFFF",
};

export const CALENDAR_COLORS = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// ========== LOADING ==========
export const Loading: React.FC<{ message?: string }> = ({ message }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    {message && <Text style={styles.loadingText}>{message}</Text>}
  </View>
);

// ========== BUTTON ==========
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  style,
}) => {
  const bgColor = {
    primary: COLORS.primary,
    secondary: COLORS.backgroundLight,
    danger: COLORS.error,
    ghost: "transparent",
  }[variant];

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// ========== INPUT ==========
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "words";
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  multiline,
  keyboardType,
  autoCapitalize,
}) => (
  <View style={styles.inputContainer}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textMuted}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
    />
  </View>
);

// ========== COLOR PICKER ==========
interface ColorPickerProps {
  selected: string;
  onSelect: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selected,
  onSelect,
}) => (
  <View style={styles.colorPicker}>
    {CALENDAR_COLORS.map((color) => (
      <TouchableOpacity
        key={color}
        style={[
          styles.colorItem,
          { backgroundColor: color },
          selected === color && styles.colorItemSelected,
        ]}
        onPress={() => onSelect(color)}
      >
        {selected === color && (
          <Ionicons name="checkmark" size={18} color={COLORS.white} />
        )}
      </TouchableOpacity>
    ))}
  </View>
);

// ========== CALENDAR HEADER ==========
export const CalendarHeader: React.FC = () => {
  const { mesAtual, mesAnterior, proximoMes, irParaHoje } = useApp();

  return (
    <View style={styles.calHeader}>
      <View style={styles.calNavRow}>
        <TouchableOpacity onPress={mesAnterior} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={irParaHoje}>
          <Text style={styles.calMes}>{MESES[mesAtual.mes]}</Text>
          <Text style={styles.calAno}>{mesAtual.ano}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={proximoMes} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.hojeBtn} onPress={irParaHoje}>
        <Text style={styles.hojeBtnText}>Hoje</Text>
      </TouchableOpacity>
    </View>
  );
};

// ========== CALENDAR GRID ==========
interface CalendarGridProps {
  onDayPress: (date: Date, eventosNoDia: Evento[]) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ onDayPress }) => {
  const { mesAtual, eventos } = useApp();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const dias = React.useMemo(() => {
    const result: {
      date: Date;
      day: number;
      currentMonth: boolean;
      isToday: boolean;
      eventos: Evento[];
    }[] = [];
    const hoje = new Date();
    const primeiro = new Date(mesAtual.ano, mesAtual.mes, 1);
    const ultimo = new Date(mesAtual.ano, mesAtual.mes + 1, 0);
    const primeiroDiaSemana = primeiro.getDay();

    // Dias do mês anterior
    const mesAnteriorUltimo = new Date(mesAtual.ano, mesAtual.mes, 0).getDate();
    for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
      const d = mesAnteriorUltimo - i;
      const date = new Date(mesAtual.ano, mesAtual.mes - 1, d);
      result.push({
        date,
        day: d,
        currentMonth: false,
        isToday: false,
        eventos: [],
      });
    }

    // Dias do mês atual
    for (let d = 1; d <= ultimo.getDate(); d++) {
      const date = new Date(mesAtual.ano, mesAtual.mes, d);
      const isToday = date.toDateString() === hoje.toDateString();
      const eventosNoDia = eventos.filter((e) => {
        const inicio = new Date(e.dataInicio);
        return inicio.toDateString() === date.toDateString();
      });
      result.push({
        date,
        day: d,
        currentMonth: true,
        isToday,
        eventos: eventosNoDia,
      });
    }

    // Completar semanas
    while (result.length < 42) {
      const d = result.length - ultimo.getDate() - primeiroDiaSemana + 1;
      const date = new Date(mesAtual.ano, mesAtual.mes + 1, d);
      result.push({
        date,
        day: d,
        currentMonth: false,
        isToday: false,
        eventos: [],
      });
    }

    return result;
  }, [mesAtual, eventos]);

  const handlePress = (item: (typeof dias)[0]) => {
    setSelectedDate(item.date);
    onDayPress(item.date, item.eventos);
  };

  return (
    <View style={styles.gridContainer}>
      <View style={styles.weekHeader}>
        {DIAS_SEMANA.map((d) => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.daysGrid}>
        {dias.map((item, idx) => {
          const isSelected =
            selectedDate?.toDateString() === item.date.toDateString();
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dayCell,
                !item.currentMonth && styles.dayCellOther,
                item.isToday && styles.dayCellToday,
                isSelected && styles.dayCellSelected,
              ]}
              onPress={() => handlePress(item)}
            >
              <Text
                style={[
                  styles.dayText,
                  !item.currentMonth && styles.dayTextOther,
                  isSelected && styles.dayTextSelected,
                ]}
              >
                {item.day}
              </Text>
              {item.eventos.length > 0 && (
                <View style={styles.eventDots}>
                  {item.eventos.slice(0, 3).map((e, i) => (
                    <View
                      key={i}
                      style={[
                        styles.eventDot,
                        { backgroundColor: e.cor || COLORS.primary },
                      ]}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ========== CALENDAR SELECTOR ==========
interface CalendarSelectorProps {
  onCreatePress: () => void;
}

export const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  onCreatePress,
}) => {
  const { calendarios, calendarioAtivo, selectCalendario } = useApp();

  return (
    <View style={styles.selectorContainer}>
      <View style={styles.selectorHeader}>
        <Text style={styles.selectorTitle}>Calendários</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onCreatePress}>
          <Ionicons name="add" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectorList}
      >
        {calendarios.map((cal) => (
          <TouchableOpacity
            key={cal.id}
            style={[
              styles.calItem,
              { borderLeftColor: cal.cor },
              calendarioAtivo?.id === cal.id && styles.calItemActive,
            ]}
            onPress={() => selectCalendario(cal)}
          >
            <Text style={styles.calItemName} numberOfLines={1}>
              {cal.nome}
            </Text>
            {cal.proprietario === false && (
              <Text style={styles.calItemShared}>Compartilhado</Text>
            )}
          </TouchableOpacity>
        ))}
        {calendarios.length === 0 && (
          <Text style={styles.emptyText}>Crie seu primeiro calendário</Text>
        )}
      </ScrollView>
    </View>
  );
};

// ========== EVENT CARD ==========
interface EventCardProps {
  evento: Evento;
  onPress: () => void;
  onDelete?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  evento,
  onPress,
  onDelete,
}) => {
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.eventCard,
        { borderLeftColor: evento.cor || COLORS.primary },
      ]}
      onPress={onPress}
    >
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{evento.titulo}</Text>
        <Text style={styles.eventTime}>
          {evento.diaInteiro
            ? "Dia inteiro"
            : `${formatTime(evento.dataInicio)} - ${formatTime(
                evento.dataFim
              )}`}
        </Text>
        {evento.local && <Text style={styles.eventLocal}>{evento.local}</Text>}
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

// ========== FAB ==========
interface FABProps {
  onPress: () => void;
}

export const FAB: React.FC<FABProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.fab} onPress={onPress}>
    <Ionicons name="add" size={28} color={COLORS.white} />
  </TouchableOpacity>
);

// ========== STYLES ==========
const styles = StyleSheet.create({
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: { marginTop: 16, color: COLORS.textSecondary, fontSize: 16 },

  // Button
  button: { padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: COLORS.white, fontWeight: "600", fontSize: 16 },

  // Input
  inputContainer: { marginBottom: 16 },
  inputLabel: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },

  // Color Picker
  colorPicker: { flexDirection: "row", flexWrap: "wrap", gap: 10, padding: 8 },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  colorItemSelected: { borderWidth: 3, borderColor: COLORS.white },

  // Calendar Header
  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.backgroundLight,
  },
  calNavRow: { flexDirection: "row", alignItems: "center" },
  navBtn: { padding: 8 },
  calMes: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  calAno: { fontSize: 14, color: COLORS.textSecondary, textAlign: "center" },
  hojeBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  hojeBtnText: { color: COLORS.white, fontWeight: "600" },

  // Calendar Grid
  gridContainer: { padding: 8 },
  weekHeader: { flexDirection: "row", marginBottom: 8 },
  weekDay: {
    flex: 1,
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
    backgroundColor: COLORS.backgroundLight,
    margin: 1,
    borderRadius: 8,
  },
  dayCellOther: { opacity: 0.4 },
  dayCellToday: { borderWidth: 2, borderColor: COLORS.primary },
  dayCellSelected: { backgroundColor: COLORS.primary },
  dayText: { fontSize: 14, color: COLORS.text, fontWeight: "500" },
  dayTextOther: { color: COLORS.textMuted },
  dayTextSelected: { color: COLORS.white, fontWeight: "700" },
  eventDots: { flexDirection: "row", marginTop: 2, gap: 2 },
  eventDot: { width: 6, height: 6, borderRadius: 3 },

  // Calendar Selector
  selectorContainer: {
    backgroundColor: COLORS.backgroundLight,
    paddingVertical: 12,
  },
  selectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  selectorTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorList: { paddingHorizontal: 16, gap: 10 },
  calItem: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    minWidth: 120,
  },
  calItemActive: {
    backgroundColor: COLORS.primary + "30",
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  calItemName: { color: COLORS.text, fontWeight: "500" },
  calItemShared: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  emptyText: { color: COLORS.textMuted, fontStyle: "italic" },

  // Event Card
  eventCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 10,
    flexDirection: "row",
    padding: 14,
  },
  eventContent: { flex: 1 },
  eventTitle: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  eventTime: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  eventLocal: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
  deleteBtn: { padding: 4 },

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
