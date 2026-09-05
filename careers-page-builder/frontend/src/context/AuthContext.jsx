import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [companySlug, setCompanySlug] = useState(() => localStorage.getItem('company_slug'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // In a production app we verify token freshness or decode
      const storedSlug = localStorage.getItem('company_slug');
      const storedEmail = localStorage.getItem('user_email');
      const storedRole = localStorage.getItem('user_role');
      if (storedEmail) {
        setUser({ email: storedEmail, role: storedRole, companySlug: storedSlug });
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('company_slug', data.company_slug || '');
    localStorage.setItem('user_email', data.email);
    localStorage.setItem('user_role', data.role);
    setToken(data.access_token);
    setCompanySlug(data.company_slug);
    setUser({ email: data.email, role: data.role, companySlug: data.company_slug });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('company_slug');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    setToken(null);
    setCompanySlug(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, companySlug, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
