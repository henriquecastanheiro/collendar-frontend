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
}

export interface Evento {
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  local?: string;
  cor?: string;
  recorrente?: boolean;
  tipoRecorrencia?: string;
}