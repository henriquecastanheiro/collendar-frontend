export const formatarData = (d: string) => 
  d ? new Date(d).toLocaleString('pt-BR', { 
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
  }) : '';

export const CORES = ['#3788d8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];