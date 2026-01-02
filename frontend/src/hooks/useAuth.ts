import { useState, useEffect } from 'react';
import { authApi, AuthUser, LoginData, RegisterData } from '../services/authApi';

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login for:', data.email);
      
      const response = await authApi.login(data);
      console.log('Login response received:', response);
      
      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server');
      }
      
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      console.log('Login successful, user set:', user.email);
    } catch (err: any) {
      console.error('Login error in useAuth:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register(data);
      const { user, token } = response.data;
      
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      setShowWelcome(true); // Show welcome modal for new users
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    authApi.logout().catch(console.error);
  };

  const clearError = () => {
    setError(null);
  };

  const checkAuth = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getMe();
      setUser(response.data);
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [token]);

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    showWelcome,
    setShowWelcome
  };
};