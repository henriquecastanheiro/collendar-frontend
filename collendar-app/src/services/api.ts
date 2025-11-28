import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.25.29:8081",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro ao buscar token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - limpar storage
      try {
        await AsyncStorage.multiRemove([
          "token",
          "userId",
          "userName",
          "userEmail",
        ]);
      } catch (e) {
        console.error("Erro ao limpar storage:", e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Funções auxiliares para lidar com erros
export const getErrorMessage = (error: any): string => {
  if (!error.response) {
    return "Erro de conexão. Verifique sua internet.";
  }

  const status = error.response.status;
  const message = error.response.data?.message || error.response.data?.error;

  switch (status) {
    case 400:
      return message || "Dados inválidos. Verifique os campos.";
    case 401:
      return "Sessão expirada. Faça login novamente.";
    case 403:
      return "Você não tem permissão para esta ação.";
    case 404:
      return "Recurso não encontrado.";
    case 409:
      return message || "Conflito. Este recurso já existe.";
    case 500:
      return "Erro no servidor. Tente novamente mais tarde.";
    default:
      return message || "Ocorreu um erro. Tente novamente.";
  }
};
