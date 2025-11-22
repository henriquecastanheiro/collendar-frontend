import { API_BASE_URL } from "./config";
import type { Usuario } from "../types";

interface LoginResponse {
  token: string;
  usuarioId: string;
  nome: string;
  email: string;
  roles: string[];
}

export const authService = {
  async login(
    email: string,
    senha: string
  ): Promise<{ token: string; usuario: Usuario }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login: email, senha }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Credenciais inválidas");
    }

    const data: LoginResponse = await response.json();

    return {
      token: data.token,
      usuario: {
        id: data.usuarioId,
        nome: data.nome,
        email: data.email,
      },
    };
  },

  async register(nome: string, email: string, senha: string): Promise<Usuario> {
    const url = `${API_BASE_URL}/usuarios`;
    // Log do payload e URL para ajudar no debug de ambiente
    console.info("Register request:", {
      url,
      payload: { nome, email, senha: "***" },
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (!response.ok) {
      // Ler corpo da resposta para obter mensagem detalhada do servidor
      const text = await response.text();
      let serverMessage = text;
      try {
        const parsed = JSON.parse(text);
        // suporta formatos { message: '...' } ou { erro: '...' }
        serverMessage = parsed.message || parsed.erro || JSON.stringify(parsed);
      } catch (e) {
        // não é JSON, manter texto cru
      }

      console.error(`Register failed. status=${response.status}, body=${text}`);

      throw new Error(
        serverMessage || "Erro ao criar conta. Email pode já estar cadastrado."
      );
    }

    const data = await response.json();
    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
    };
  },
};
