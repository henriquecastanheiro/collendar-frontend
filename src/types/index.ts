export interface Usuario {
  id: string;
  nome: string;
  email?: string;
}

export interface Calendario {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  usuarioId: string;
  usuarioNome?: string;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  local?: string;
  cor?: string;
  diaInteiro?: boolean;
  recorrente?: boolean;
  tipoRecorrencia?: 'DIARIA' | 'SEMANAL' | 'MENSAL' | 'ANUAL';
  calendarioId: string;
}