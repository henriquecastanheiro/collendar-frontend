import { API_BASE_URL } from "./config";
import type { Calendario } from "../types";

export const calendarioService = {
  async listarMeusCalendarios(
    usuarioId: string,
    token: string
  ): Promise<Calendario[]> {
    const response = await fetch(
      `${API_BASE_URL}/calendarios/usuario/${usuarioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar calendários");
    }

    const data = await response.json();
    return data.map((cal: any) => ({
      id: cal.id,
      nome: cal.nome,
      descricao: cal.descricao,
      cor: cal.cor,
      usuarioId: cal.usuarioId,
      usuarioNome: cal.usuarioNome,
      ehProprietario: true,
    }));
  },

  async listarCalendariosCompartilhados(
    usuarioId: string,
    token: string
  ): Promise<Calendario[]> {
    const response = await fetch(
      `${API_BASE_URL}/compartilhamentos/usuario/${usuarioId}/calendarios`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar calendários compartilhados");
    }

    const data = await response.json();
    return data.map((cal: any) => ({
      id: cal.id,
      nome: cal.nome,
      descricao: cal.descricao,
      cor: cal.cor,
      usuarioId: cal.usuarioId,
      usuarioNome: cal.usuarioNome,
      ehProprietario: false,
    }));
  },

  async criar(
    calendario: { nome: string; descricao?: string; cor: string },
    usuarioId: string,
    token: string
  ): Promise<Calendario> {
    const response = await fetch(
      `${API_BASE_URL}/calendarios?usuarioId=${usuarioId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(calendario),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar calendário");
    }

    const data = await response.json();
    return {
      id: data.id,
      nome: data.nome,
      descricao: data.descricao,
      cor: data.cor,
      usuarioId: data.usuarioId,
      usuarioNome: data.usuarioNome,
      ehProprietario: true,
    };
  },

  async atualizar(
    id: string,
    calendario: { nome: string; descricao?: string; cor: string },
    token: string
  ): Promise<Calendario> {
    const response = await fetch(`${API_BASE_URL}/calendarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(calendario),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar calendário");
    }

    return response.json();
  },

  async deletar(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/calendarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar calendário");
    }
  },
};
