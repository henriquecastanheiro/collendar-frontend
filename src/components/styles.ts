import { StyleSheet } from 'react-native';

// Estilos compartilhados entre componentes
export const sharedStyles = StyleSheet.create({
  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  cardTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  
  cardInfo: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },

  // Badges
  badge: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
    fontSize: 11,
    overflow: 'hidden',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  headerTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3788d8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  fabTxt: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
  },

  // Inputs
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },

  // Botões
  btn: {
    backgroundColor: '#3788d8',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  btnSecundario: {
    backgroundColor: '#e5e5e5',
  },

  btnDanger: {
    backgroundColor: '#ef4444',
  },

  btnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  btnTxtSecundario: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },

  // Containers
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  vazio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },

  // Links
  link: {
    color: '#3788d8',
    textAlign: 'center',
    fontSize: 14,
  },
});

// Cores do tema
export const colors = {
  primary: '#3788d8',
  secondary: '#e5e5e5',
  danger: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  
  text: '#333',
  textLight: '#666',
  textMuted: '#999',
  
  background: '#f5f5f5',
  card: '#fff',
  border: '#ddd',
  
  // Cores para calendários
  calendarios: [
    '#3788d8',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
  ],
};