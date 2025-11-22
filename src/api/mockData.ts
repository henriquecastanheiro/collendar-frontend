import type { Usuario, Calendario, Evento, Compartilhamento } from '../types';

export const mockUser: Usuario = {
  id: '1',
  nome: 'João Silva',
  email: 'joao@email.com'
};

export const mockCalendarios: Calendario[] = [
  {
    id: '1',
    nome: 'Trabalho',
    descricao: 'Reuniões e tarefas',
    cor: '#3788d8',
    usuarioId: '1',
    usuarioNome: 'João Silva',
    ehProprietario: true
  },
  {
    id: '2',
    nome: 'Pessoal',
    descricao: 'Compromissos pessoais',
    cor: '#10b981',
    usuarioId: '1',
    usuarioNome: 'João Silva',
    ehProprietario: true
  },
  {
    id: '3',
    nome: 'Estudos',
    descricao: 'Aulas e provas',
    cor: '#f59e0b',
    usuarioId: '1',
    usuarioNome: 'João Silva',
    ehProprietario: true
  }
];

// Calendários compartilhados com o usuário
export const mockCalendariosCompartilhados: Calendario[] = [
  {
    id: '4',
    nome: 'Projeto TCC',
    descricao: 'Calendário do grupo',
    cor: '#8b5cf6',
    usuarioId: '2',
    usuarioNome: 'Maria Santos',
    ehProprietario: false
  },
  {
    id: '5',
    nome: 'Família',
    descricao: 'Eventos familiares',
    cor: '#ec4899',
    usuarioId: '3',
    usuarioNome: 'Pedro Oliveira',
    ehProprietario: false
  }
];

export const mockEventos: Evento[] = [
  {
    id: '1',
    titulo: 'Reunião de Equipe',
    descricao: 'Alinhamento semanal',
    dataInicio: '2025-11-21T10:00',
    dataFim: '2025-11-21T11:00',
    local: 'Sala 01',
    cor: '#3788d8',
    diaInteiro: false,
    recorrente: true,
    tipoRecorrencia: 'SEMANAL',
    calendarioId: '1'
  },
  {
    id: '2',
    titulo: 'Entrega do Projeto',
    descricao: 'Apresentação final',
    dataInicio: '2025-11-25T14:00',
    dataFim: '2025-11-25T16:00',
    local: 'Auditório',
    cor: '#ef4444',
    diaInteiro: false,
    recorrente: false,
    calendarioId: '1'
  },
  {
    id: '3',
    titulo: 'Academia',
    descricao: 'Treino de musculação',
    dataInicio: '2025-11-21T18:00',
    dataFim: '2025-11-21T19:30',
    local: 'Smart Fit',
    cor: '#10b981',
    diaInteiro: false,
    recorrente: true,
    tipoRecorrencia: 'DIARIA',
    calendarioId: '2'
  }
];

// Mock de compartilhamentos
export const mockCompartilhamentos: Compartilhamento[] = [
  {
    id: '1',
    calendarioId: '1',
    calendarioNome: 'Trabalho',
    usuarioId: '2',
    usuarioNome: 'Maria Santos',
    permissao: 'EDITAR'
  },
  {
    id: '2',
    calendarioId: '1',
    calendarioNome: 'Trabalho',
    usuarioId: '3',
    usuarioNome: 'Pedro Oliveira',
    permissao: 'VISUALIZAR'
  }
];

// Mock de usuários disponíveis para compartilhar
export const mockUsuariosDisponiveis: Usuario[] = [
  { id: '2', nome: 'Maria Santos', email: 'maria@email.com' },
  { id: '3', nome: 'Pedro Oliveira', email: 'pedro@email.com' },
  { id: '4', nome: 'Ana Costa', email: 'ana@email.com' },
  { id: '5', nome: 'Carlos Lima', email: 'carlos@email.com' }
];