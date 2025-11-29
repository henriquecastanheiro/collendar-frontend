import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  authApi,
  calendarioApi,
  eventoApi,
  compartilhamentoApi,
  setAuthToken,
  Usuario,
  Calendario,
  Evento,
  EventoRequest,
  Compartilhamento,
} from "../services/api";

interface AppContextData {
  // Auth
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;

  // Calendários
  calendarios: Calendario[];
  calendarioAtivo: Calendario | null;
  loadCalendarios: () => Promise<void>;
  selectCalendario: (cal: Calendario) => void;
  createCalendario: (
    nome: string,
    descricao?: string,
    cor?: string
  ) => Promise<void>;

  // Eventos
  eventos: Evento[];
  loadEventos: () => Promise<void>;
  createEvento: (evento: EventoRequest) => Promise<void>;
  updateEvento: (id: string, evento: EventoRequest) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;

  // Compartilhamentos
  compartilhamentos: Compartilhamento[];
  loadCompartilhamentos: () => Promise<void>;
  compartilhar: (
    email: string,
    permissao: "VISUALIZAR" | "EDITAR"
  ) => Promise<void>;
  removerCompartilhamento: (id: string) => Promise<void>;

  // Navegação do calendário
  mesAtual: { ano: number; mes: number };
  mesAnterior: () => void;
  proximoMes: () => void;
  irParaHoje: () => void;

  isLoading: boolean;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [calendarios, setCalendarios] = useState<Calendario[]>([]);
  const [calendarioAtivo, setCalendarioAtivo] = useState<Calendario | null>(
    null
  );
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [compartilhamentos, setCompartilhamentos] = useState<
    Compartilhamento[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState({
    ano: hoje.getFullYear(),
    mes: hoje.getMonth(),
  });

  // ========== AUTH ==========
  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const { data } = await authApi.login(email, senha);
      setAuthToken(data.token);
      setUser({ id: data.usuarioId, nome: data.nome, email: data.email });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nome: string, email: string, senha: string) => {
    setIsLoading(true);
    try {
      await authApi.register(nome, email, senha);
      await login(email, senha);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    setCalendarios([]);
    setCalendarioAtivo(null);
    setEventos([]);
  };

  // ========== CALENDÁRIOS ==========
  const loadCalendarios = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await calendarioApi.listar();
      setCalendarios(data);
      if (data.length > 0 && !calendarioAtivo) {
        setCalendarioAtivo(data[0]);
      }
    } catch (err) {
      console.error("Erro ao carregar calendários:", err);
    }
  }, [user, calendarioAtivo]);

  const selectCalendario = (cal: Calendario) => setCalendarioAtivo(cal);

  const createCalendario = async (
    nome: string,
    descricao?: string,
    cor?: string
  ) => {
    const { data } = await calendarioApi.criar(nome, descricao, cor);
    setCalendarios((prev) => [...prev, data]);
    setCalendarioAtivo(data);
  };

  // ========== EVENTOS ==========
  const loadEventos = useCallback(async () => {
    if (!calendarioAtivo) {
      setEventos([]);
      return;
    }
    try {
      const start = new Date(mesAtual.ano, mesAtual.mes, 1);
      const end = new Date(mesAtual.ano, mesAtual.mes + 1, 0, 23, 59, 59);
      const { data } = await eventoApi.buscarPorPeriodo(
        calendarioAtivo.id,
        start.toISOString().slice(0, 19),
        end.toISOString().slice(0, 19)
      );
      setEventos(data);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    }
  }, [calendarioAtivo, mesAtual]);

  const createEvento = async (evento: EventoRequest) => {
    const { data } = await eventoApi.criar(evento);
    setEventos((prev) => [...prev, data]);
  };

  const updateEvento = async (id: string, evento: EventoRequest) => {
    const { data } = await eventoApi.atualizar(id, evento);
    setEventos((prev) => prev.map((e) => (e.id === id ? data : e)));
  };

  const deleteEvento = async (id: string) => {
    await eventoApi.deletar(id);
    setEventos((prev) => prev.filter((e) => e.id !== id));
  };

  // ========== COMPARTILHAMENTOS ==========
  const loadCompartilhamentos = useCallback(async () => {
    if (!calendarioAtivo || calendarioAtivo.proprietario === false) {
      setCompartilhamentos([]);
      return;
    }
    try {
      const { data } = await compartilhamentoApi.listarPorCalendario(
        calendarioAtivo.id
      );
      setCompartilhamentos(data);
    } catch (err) {
      console.error("Erro ao carregar compartilhamentos:", err);
    }
  }, [calendarioAtivo]);

  const compartilhar = async (
    email: string,
    permissao: "VISUALIZAR" | "EDITAR"
  ) => {
    if (!calendarioAtivo) return;
    const { data } = await compartilhamentoApi.criar(
      calendarioAtivo.id,
      email,
      permissao
    );
    setCompartilhamentos((prev) => [...prev, data]);
  };

  const removerCompartilhamento = async (id: string) => {
    await compartilhamentoApi.deletar(id);
    setCompartilhamentos((prev) => prev.filter((c) => c.id !== id));
  };

  // ========== NAVEGAÇÃO DO CALENDÁRIO ==========
  const mesAnterior = () => {
    setMesAtual((prev) =>
      prev.mes === 0
        ? { ano: prev.ano - 1, mes: 11 }
        : { ...prev, mes: prev.mes - 1 }
    );
  };

  const proximoMes = () => {
    setMesAtual((prev) =>
      prev.mes === 11
        ? { ano: prev.ano + 1, mes: 0 }
        : { ...prev, mes: prev.mes + 1 }
    );
  };

  const irParaHoje = () => {
    const h = new Date();
    setMesAtual({ ano: h.getFullYear(), mes: h.getMonth() });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        calendarios,
        calendarioAtivo,
        loadCalendarios,
        selectCalendario,
        createCalendario,
        eventos,
        loadEventos,
        createEvento,
        updateEvento,
        deleteEvento,
        compartilhamentos,
        loadCompartilhamentos,
        compartilhar,
        removerCompartilhamento,
        mesAtual,
        mesAnterior,
        proximoMes,
        irParaHoje,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
