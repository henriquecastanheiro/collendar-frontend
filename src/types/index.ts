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
  ehProprietario?: boolean; // Indica se o usuário logado é o dono
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

export interface Compartilhamento {
  id: string;
  calendarioId: string;
  calendarioNome: string;
  usuarioId: string;
  usuarioNome: string;
  permissao: 'VISUALIZAR' | 'EDITAR';
}