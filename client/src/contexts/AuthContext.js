import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Simular verificación de token
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.id) {
        setUser(userData);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Login temporal para demo
      if (email === 'admin@sahraperfumes.com' && password === 'admin123') {
        const userData = {
          id: 1,
          email: 'admin@sahraperfumes.com',
          name: 'Administrador',
          first_name: 'Administrador',
          role: 'admin',
          phone: '123-456-7890',
          address: 'Dirección de ejemplo',
          city: 'Ciudad',
          postalCode: '12345'
        };
        
        const token = 'demo-token-' + Date.now();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Registro temporal para demo
      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'user'
      };
      
      const token = 'demo-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 