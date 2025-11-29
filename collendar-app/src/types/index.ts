// Tipos de dados usados no aplicativo

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo?: boolean;
  roles?: string[];
}

export interface LoginResponse {
  token: string;
  tipo: string;
  usuarioId: string;
  nome: string;
  email: string;
  roles: string[];
}

// ✅ CORRIGIDO: Alinhado com CalendarioResponseDTO do backend
export interface Calendario {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  usuarioId: string; // ✅ Mudado de proprietarioId
  usuarioNome?: string; // ✅ Mudado de proprietarioNome
  createdAt?: string; // ✅ Adicionado
  updatedAt?: string; // ✅ Adicionado
  proprietario?: boolean; // ✅ Adicionado (indica se é dono)
  permissao?: "VISUALIZAR" | "EDITAR" | null; // ✅ Adicionado
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  local: string;
  cor: string;
  diaInteiro: boolean;
  recorrente: boolean;
  tipoRecorrencia?: "DIARIA" | "SEMANAL" | "MENSAL" | "ANUAL";
  calendarioId: string;
  calendarioNome: string; // ✅ Removido opcional (sempre vem do backend)
}

// ✅ CORRIGIDO: Alinhado com CompartilhamentoResponseDTO do backend
export interface Compartilhamento {
  id: string;
  calendarioId: string;
  calendarioNome: string;
  usuarioId: string; // ✅ Mudado de destinatarioId
  usuarioNome: string; // ✅ Mudado de destinatarioNome
  usuarioEmail: string; // ✅ Mudado de destinatarioEmail
  permissao: "VISUALIZAR" | "EDITAR";
  createdAt: string; // ✅ Mudado de dataCompartilhamento
}

export interface Permissao {
  proprietario: boolean;
  podeVisualizar: boolean;
  podeEditar: boolean;
  permissao: "VISUALIZAR" | "EDITAR" | null;
}

export interface CreateCalendarioDTO {
  nome: string;
  descricao: string;
  cor: string;
}

export interface CreateEventoDTO {
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  local: string;
  cor: string;
  diaInteiro: boolean;
  recorrente: boolean;
  tipoRecorrencia?: "DIARIA" | "SEMANAL" | "MENSAL" | "ANUAL";
  calendarioId: string;
}

export interface CreateCompartilhamentoDTO {
  calendarioId: string;
  emailDestinatario: string;
  permissao: "VISUALIZAR" | "EDITAR";
}

export interface MarkedDate {
  dots?: Array<{ color: string }>;
  selected?: boolean;
  selectedColor?: string;
}

// Tipos de navegação
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type CalendarStackParamList = {
  CalendarMain: undefined;
  EventDetails: { eventoId: string };
  CreateEvent: {
    calendarioId: string;
    eventoId?: string;
    initialDate?: string;
  };
};

export type MyCalendarsStackParamList = {
  MyCalendarsMain: undefined;
  CreateCalendar: { calendarioId?: string };
  CalendarDetails: { calendarioId: string };
  ShareCalendar: { calendarioId: string };
};

export type SharedStackParamList = {
  SharedCalendarsMain: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
};

export type MainTabsParamList = {
  CalendarTab: undefined;
  MyCalendarsTab: undefined;
  SharedTab: undefined;
  ProfileTab: undefined;
};
