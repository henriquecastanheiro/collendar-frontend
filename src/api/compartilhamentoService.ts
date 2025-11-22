import { API_BASE_URL } from "./config";
import type { Compartilhamento, Usuario } from "../types";

export const compartilhamentoService = {
  async listarPorCalendario(
    calendarioId: string,
    token: string
  ): Promise<Compartilhamento[]> {
    const response = await fetch(
      `${API_BASE_URL}/compartilhamentos/calendario/${calendarioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar compartilhamentos");
    }

    const data = await response.json();
    return data.map((comp: any) => ({
      id: comp.id,
      calendarioId: comp.calendarioId,
      calendarioNome: comp.calendarioNome,
      usuarioId: comp.usuarioId,
      usuarioNome: comp.usuarioNome,
      permissao: comp.permissao,
    }));
  },

  async compartilhar(
    calendarioId: string,
    usuarioId: string,
    permissao: "VISUALIZAR" | "EDITAR",
    token: string
  ): Promise<Compartilhamento> {
    const response = await fetch(
      `${API_BASE_URL}/compartilhamentos?calendarioId=${calendarioId}&usuarioId=${usuarioId}&permissao=${permissao}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erro ao compartilhar calendário");
    }

    return response.json();
  },

  async atualizarPermissao(
    compartilhamentoId: string,
    novaPermissao: "VISUALIZAR" | "EDITAR",
    token: string
  ): Promise<Compartilhamento> {
    const response = await fetch(
      `${API_BASE_URL}/compartilhamentos/${compartilhamentoId}/permissao?permissao=${novaPermissao}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao atualizar permissão");
    }

    return response.json();
  },

  async remover(
    calendarioId: string,
    usuarioId: string,
    token: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/compartilhamentos/calendario/${calendarioId}/usuario/${usuarioId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao remover compartilhamento");
    }
  },

  async buscarUsuarios(query: string, token: string): Promise<Usuario[]> {
    // Aqui você pode implementar um endpoint de busca de usuários
    // Por enquanto, vou buscar todos os usuários
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar usuários");
    }

    const data = await response.json();
    return data
      .filter((u: any) => u.nome.toLowerCase().includes(query.toLowerCase()))
      .map((u: any) => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
      }));
  },
};
