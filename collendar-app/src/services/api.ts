import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.25.20:8081",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Converte QUALQUER coisa que pareça boolean
const parseBoolean = (value: any): any => {
  if (value === null || value === undefined) return value;

  // String booleans
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "True") return true;
  if (value === "False") return false;
  if (value === "TRUE") return true;
  if (value === "FALSE") return false;

  // Números
  if (value === 1) return true;
  if (value === 0) return false;

  return value;
};

// ✅ Aplica recursivamente em TUDO
const fixData = (data: any): any => {
  if (data === null || data === undefined) return data;

  // Primitivos
  if (typeof data !== "object") {
    return parseBoolean(data);
  }

  // Arrays
  if (Array.isArray(data)) {
    return data.map(fixData);
  }

  // Objetos
  const fixed: any = {};
  for (const key in data) {
    fixed[key] = fixData(data[key]);
  }
  return fixed;
};

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

api.interceptors.response.use(
  (response) => {
    // ✅ FORÇA conversão de tudo
    response.data = fixData(response.data);
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
