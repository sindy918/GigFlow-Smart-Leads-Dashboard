import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales User';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: 'Admin' | 'Sales User') => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gigflow_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          localStorage.removeItem('gigflow_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Fetch user error:', err);
        // On network error, we don't necessarily want to wipe the session, but let's set user to null
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, API_URL]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('gigflow_token', data.token);
        setToken(data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
        setLoading(false);
        return true;
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Login failed: Connection error. Please check if the backend API service is running.`);
      setLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'Admin' | 'Sales User' = 'Sales User'
  ): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('gigflow_token', data.token);
        setToken(data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
        setLoading(false);
        return true;
      } else {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(`Registration failed: Connection error. Please check if the backend API service is running.`);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('gigflow_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
