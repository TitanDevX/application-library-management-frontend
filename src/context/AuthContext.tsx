import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/models/users';
import {axios} from '@/services/api';

interface AuthContextType {
  authLoading: boolean;           // true while checking token
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      axios.defaults.headers.common.Authorization = `Token ${token}`;
      setUser(JSON.parse(storedUser));
    }

    setAuthLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', { email, password });

      if (!response.data?.token) return false;

      const token = response.data.token;
      axios.defaults.headers.common.Authorization = `Token ${token}`;
      response.data.id = response.data.user_id;
      setUser(response.data);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data));

      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout/');
    } catch (err) {
      console.warn('Logout error:', err);
    }
    setUser(null);
    axios.defaults.headers.common.Authorization = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

return (
    <AuthContext.Provider value={{ authLoading, user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
