import type { Usuario, Calendario, Evento } from '../types';

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
    usuarioNome: 'João Silva'
  },
  {
    id: '2',
    nome: 'Pessoal',
    descricao: 'Compromissos pessoais',
    cor: '#10b981',
    usuarioId: '1',
    usuarioNome: 'João Silva'
  },
  {
    id: '3',
    nome: 'Estudos',
    descricao: 'Aulas e provas',
    cor: '#f59e0b',
    usuarioId: '1',
    usuarioNome: 'João Silva'
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