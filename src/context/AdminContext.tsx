import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/models/users';
import {axios, fetchUsers} from '@/services/api';
import { useAuth } from './AuthContext';

interface AdminContextType {
  users: User[] | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[] | null>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    if(!isAuthenticated) return;
      const init = async () => {
       try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    init();
  }, [isAuthenticated]);



return (
    <AdminContext.Provider value={{ users }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
