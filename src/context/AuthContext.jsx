import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí podrías verificar el token con el backend
      // Por ahora solo simulamos
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, id, email: userEmail, nombre, rol } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, email: userEmail, nombre, rol }));
      
      setUser({ id, email: userEmail, nombre, rol });
      
      return { 
        success: true, 
        user: { id, email: userEmail, nombre, rol: rol.toLowerCase() } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al iniciar sesión' 
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