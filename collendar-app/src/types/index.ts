// Tipos de dados usados no aplicativo

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  dataCriacao?: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  usuarioId: string;
  nome: string;
  email: string;
  roles: string[];
}

export interface Calendario {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  proprietarioId: string;
  proprietarioNome?: string;
  dataCriacao?: string;
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
  calendarioNome?: string;
}

export interface Compartilhamento {
  id: string;
  calendarioId: string;
  calendarioNome: string;
  proprietarioNome: string;
  destinatarioId: string;
  destinatarioNome: string;
  destinatarioEmail: string;
  permissao: "VISUALIZAR" | "EDITAR";
  dataCompartilhamento: string;
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
