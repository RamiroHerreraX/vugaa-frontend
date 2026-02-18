// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';
import { login as loginService } from '../services/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password, tenant) => {
    try {
      const response = await loginService(email, password, tenant);
      
      if (response.token) {
        const userData = {
          id: response.id,
          email: response.email,
          nombre: response.nombre,
          rol: response.rol.toLowerCase(),
          instanciaId: response.instanciaId,
          instanciaNombre: response.instanciaNombre
        };
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        
        return { 
          success: true, 
          user: userData 
        };
      } else {
        return { 
          success: false, 
          error: response.mensaje || 'Error al iniciar sesión' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.mensaje || 'Error de conexión' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};