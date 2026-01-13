import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  empresa_id: string;
  rol: string;
}

interface Empresa {
  id: string;
  nombre: string;
}

export const AuthContext = React.createContext<{
  usuario: Usuario | null;
  empresa: Empresa | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nombre: string, nombre_empresa: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar token del localStorage al montar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      // Verificar que el token sea válido
      fetchUser(storedToken);
    }
  }, []);

  async function fetchUser(authToken: string) {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUsuario(response.data.usuario);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await axios.post('/api/auth/login', { email, password });
    const { usuario, token, empresa } = response.data;
    
    setUsuario(usuario);
    setEmpresa(empresa);
    setToken(token);
    setIsAuthenticated(true);
    
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async function register(email: string, password: string, nombre: string, nombre_empresa: string) {
    const response = await axios.post('/api/auth/register', {
      email,
      password,
      nombre,
      nombre_empresa
    });
    const { usuario, token, empresa } = response.data;
    
    setUsuario(usuario);
    setEmpresa(empresa);
    setToken(token);
    setIsAuthenticated(true);
    
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  function logout() {
    setUsuario(null);
    setEmpresa(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  return (
    <AuthContext.Provider value={{ usuario, empresa, token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
