import { API_BASE_URL } from "./config";
import type { Evento } from "../types";

export const eventoService = {
  async listarPorCalendario(
    calendarioId: string,
    token: string
  ): Promise<Evento[]> {
    const response = await fetch(
      `${API_BASE_URL}/eventos/calendario/${calendarioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar eventos");
    }

    const data = await response.json();
    return data.map((evt: any) => ({
      id: evt.id,
      titulo: evt.titulo,
      descricao: evt.descricao,
      dataInicio: evt.dataInicio,
      dataFim: evt.dataFim,
      local: evt.local,
      cor: evt.cor,
      diaInteiro: evt.diaInteiro,
      recorrente: evt.recorrente,
      tipoRecorrencia: evt.tipoRecorrencia,
      calendarioId: evt.calendarioId,
    }));
  },

  async criar(
    evento: {
      titulo: string;
      descricao?: string;
      dataInicio: string;
      dataFim: string;
      local?: string;
      cor?: string;
      diaInteiro?: boolean;
      recorrente?: boolean;
      tipoRecorrencia?: string;
    },
    calendarioId: string,
    token: string
  ): Promise<Evento> {
    const response = await fetch(
      `${API_BASE_URL}/eventos?calendarioId=${calendarioId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evento),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar evento");
    }

    return response.json();
  },

  async atualizar(id: string, evento: any, token: string): Promise<Evento> {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(evento),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar evento");
    }

    return response.json();
  },

  async deletar(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar evento");
    }
  },
};
