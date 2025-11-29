import axios from "axios";

// ⚠️ ALTERE PARA SEU IP
// Emulador Android: 'http://10.0.2.2:8081'
// Simulador iOS: 'http://localhost:8081'
// Celular físico: 'http://SEU_IP:8081'
const BASE_URL = "http://192.168.25.20:8081";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ========== AUTH ==========
export const authApi = {
  login: (email: string, senha: string) =>
    api.post("/auth/login", { email, senha }),

  register: (nome: string, email: string, senha: string) =>
    api.post("/usuarios", { nome, email, senha }),
};

// ========== CALENDÁRIOS ==========
export const calendarioApi = {
  listar: () => api.get("/calendarios/acessiveis"),

  criar: (nome: string, descricao?: string, cor?: string) =>
    api.post("/calendarios", { nome, descricao, cor: cor || "#6366F1" }),

  deletar: (id: string) => api.delete(`/calendarios/${id}`),
};

// ========== EVENTOS ==========
export const eventoApi = {
  listarPorCalendario: (calendarioId: string) =>
    api.get(`/eventos/calendario/${calendarioId}`),

  buscarPorPeriodo: (
    calendarioId: string,
    dataInicio: string,
    dataFim: string
  ) =>
    api.get(`/eventos/calendario/${calendarioId}/periodo`, {
      params: { dataInicio, dataFim },
    }),

  criar: (evento: EventoRequest) => api.post("/eventos", evento),

  atualizar: (id: string, evento: EventoRequest) =>
    api.put(`/eventos/${id}`, evento),

  deletar: (id: string) => api.delete(`/eventos/${id}`),
};

// ========== COMPARTILHAMENTOS ==========
export const compartilhamentoApi = {
  listarPorCalendario: (calendarioId: string) =>
    api.get(`/compartilhamentos/calendario/${calendarioId}`),

  criar: (
    calendarioId: string,
    emailDestinatario: string,
    permissao: "VISUALIZAR" | "EDITAR"
  ) =>
    api.post("/compartilhamentos", {
      calendarioId,
      emailDestinatario,
      permissao,
    }),

  deletar: (id: string) => api.delete(`/compartilhamentos/${id}`),
};

// ========== TIPOS ==========
export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface Calendario {
  id: string;
  nome: string;
  descricao: string | null;
  cor: string;
  usuarioId: string;
  usuarioNome: string;
  proprietario: boolean | null;
  permissao: "VISUALIZAR" | "EDITAR" | null;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string;
  local: string | null;
  cor: string | null;
  diaInteiro: boolean;
  calendarioId: string;
}

export interface EventoRequest {
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  local?: string;
  cor?: string;
  diaInteiro?: boolean;
  calendarioId: string;
}

export interface Compartilhamento {
  id: string;
  calendarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  permissao: "VISUALIZAR" | "EDITAR";
}

export default api;
