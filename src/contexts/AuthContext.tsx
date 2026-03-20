import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'mama' | 'doctor' | 'admin';

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<string, AppUser> = {
  'demo@mama.ru': { id: '1', email: 'demo@mama.ru', full_name: 'Демо Мама', role: 'mama' },
  'doctor@anna.ru': { id: '2', email: 'doctor@anna.ru', full_name: 'Доктор Анна', role: 'doctor' },
  'admin@anna.ru': { id: '3', email: 'admin@anna.ru', full_name: 'Администратор', role: 'admin' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('anna_mama_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser) {
      setUser(demoUser);
      localStorage.setItem('anna_mama_user', JSON.stringify(demoUser));
      return { success: true };
    }
    return { success: false, error: 'Используйте demo@mama.ru, doctor@anna.ru или admin@anna.ru' };
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    const newUser: AppUser = {
      id: crypto.randomUUID(),
      email,
      full_name: name,
      role: 'mama',
    };
    setUser(newUser);
    localStorage.setItem('anna_mama_user', JSON.stringify(newUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('anna_mama_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
