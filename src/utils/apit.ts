import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://10.0.2.2:8081'; // Configure seu IP aqui
let TOKEN: string | null = null;

const request = async (endpoint: string, method = 'GET', body: any = null) => {
  const config: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' } as any
  };
  if (TOKEN) config.headers!['Authorization'] = `Bearer ${TOKEN}`;
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${API}${endpoint}`, config);
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(await res.text() || 'Erro');
  return res.json();
};

// Auth
export const login = async (email: string, senha: string) => {
  const auth = await request('/auth/login', 'POST', { login: email, senha });
  TOKEN = auth.token;
  await AsyncStorage.setItem('token', TOKEN!);
  
  const user = await request(`/api/usuarios/email/${email}`);
  await AsyncStorage.multiSet([['userId', user.id], ['userName', user.nome]]);
  return user;
};

export const cadastrar = async (nome: string, email: string, senha: string) => {
  return request('/api/usuarios', 'POST', { nome, email, senha });
};

export const restaurarSessao = async () => {
  const token = await AsyncStorage.getItem('token');
  const id = await AsyncStorage.getItem('userId');
  const nome = await AsyncStorage.getItem('userName');
  if (token && id) {
    TOKEN = token;
    return { id, nome };
  }
  return null;
};

export const logout = async () => {
  await AsyncStorage.multiRemove(['token', 'userId', 'userName']);
  TOKEN = null;
};

// Calendários
export const listarCalendarios = (userId: string) => 
  request(`/api/calendarios/usuario/${userId}`);

export const criarCalendario = (userId: string, dados: any) => 
  request(`/api/calendarios?usuarioId=${userId}`, 'POST', dados);

export const atualizarCalendario = (id: string, dados: any) => 
  request(`/api/calendarios/${id}`, 'PUT', dados);

export const excluirCalendario = (id: string) => 
  request(`/api/calendarios/${id}`, 'DELETE');

// Eventos
export const listarEventos = (calId: string) => 
  request(`/api/eventos/calendario/${calId}`);

export const criarEvento = (calId: string, dados: any) => 
  request(`/api/eventos?calendarioId=${calId}`, 'POST', dados);

export const atualizarEvento = (id: string, dados: any) => 
  request(`/api/eventos/${id}`, 'PUT', dados);

export const excluirEvento = (id: string) => 
  request(`/api/eventos/${id}`, 'DELETE');