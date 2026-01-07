import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin } from '@/lib/api';

type User = { id?: string; email?: string; name?: string; role?: string } | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeToken(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch (e) {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => typeof localStorage !== 'undefined' ? localStorage.getItem('sc360_token') : null);
  const [user, setUser] = useState<User>(() => {
    const t = typeof localStorage !== 'undefined' ? localStorage.getItem('sc360_token') : null;
    if (t) {
      const payload = decodeToken(t);
      return payload ? { id: payload.id, email: payload.email, role: payload.role } : null;
    }
    return null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('sc360_token', token);
    else localStorage.removeItem('sc360_token');
  }, [token]);

  const signIn = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    if (res?.token) {
      setToken(res.token);
      setUser(res.user || decodeToken(res.token));
    } else {
      throw new Error('Login failed');
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default useAuth;
