import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gff_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('gff_token');
    localStorage.removeItem('gff_user');
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login({ email, password });
    const { user: userData, token } = res.data.data;
    localStorage.setItem('gff_token', token);
    localStorage.setItem('gff_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (formData) => {
    const res = await authService.register(formData);
    const { user: userData, token } = res.data.data;
    localStorage.setItem('gff_token', token);
    localStorage.setItem('gff_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('gff_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((res) => {
        setUser(res.data.data);
        localStorage.setItem('gff_user', JSON.stringify(res.data.data));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
