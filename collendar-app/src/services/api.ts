import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.25.20:8081",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Converte TUDO que for "true"/"false" string para boolean real
const fixBooleans = (obj: any): any => {
  if (obj === "true") return true;
  if (obj === "false") return false;
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(fixBooleans);
  }

  const fixed: any = {};
  for (const key in obj) {
    fixed[key] = fixBooleans(obj[key]);
  }
  return fixed;
};

// Adiciona token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Corrige booleans e trata 401
api.interceptors.response.use(
  (response) => {
    response.data = fixBooleans(response.data);
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove([
        "token",
        "userId",
        "userName",
        "userEmail",
      ]);
    }
    return Promise.reject(error);
  }
);

export default api;

export const getErrorMessage = (error: any): string => {
  if (!error.response) return "Sem conexão.";
  const msg = error.response.data?.message || error.response.data?.error;
  switch (error.response.status) {
    case 400:
      return msg || "Dados inválidos.";
    case 401:
      return "Sessão expirada.";
    case 403:
      return "Sem permissão.";
    case 404:
      return "Não encontrado.";
    case 500:
      return "Erro no servidor.";
    default:
      return msg || "Erro.";
  }
};
