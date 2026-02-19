// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiration, setTokenExpiration] = useState(null);

  // Verificar token periódicamente
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await API.get('/auth/verificar-token');
        if (!response.data.valid) {
          logout();
        }
      } catch (error) {
        logout();
      }
    };

    // Verificar cada 5 minutos
    const interval = setInterval(checkToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadUser = useCallback(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const expiration = localStorage.getItem('tokenExpiration');
    
    if (token && userStr && expiration) {
      // Verificar si el token ha expirado
      if (Date.now() > parseInt(expiration)) {
        logout();
      } else {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setTokenExpiration(parseInt(expiration));
        } catch (error) {
          console.error('Error parsing user data', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiration');
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password, tenant) => {
    try {
      const response = await API.post('/auth/login', 
        { email, password },
        { 
          headers: {
            'X-Tenant-ID': tenant
          } 
        }
      );
      
      if (response.data.token) {
        const userData = {
          id: response.data.id,
          email: response.data.email,
          nombre: response.data.nombre,
          rol: response.data.rol.toLowerCase(),
          instanciaId: response.data.instanciaId,
          instanciaNombre: response.data.instanciaNombre
        };
        
        // Calcular expiración (24 horas por defecto)
        const expiration = Date.now() + (response.data.expiresIn || 86400000);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken || '');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('tokenExpiration', expiration.toString());
        
        setUser(userData);
        setTokenExpiration(expiration);
        
        return { 
          success: true, 
          user: userData 
        };
      } else {
        return { 
          success: false, 
          error: response.data.mensaje || 'Error al iniciar sesión' 
        };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.mensaje || 'Error de conexión';
      return { 
        success: false, 
        error: errorMsg 
      };
    }
  };

  const logout = () => {
    // Llamar al endpoint de logout (opcional)
    API.post('/auth/logout').catch(console.error);
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    setUser(null);
    setTokenExpiration(null);
  };

  const recuperarPassword = async (email) => {
    try {
      const response = await API.post('/auth/recuperar-password', { email });
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        mensaje: error.response?.data?.mensaje || 'Error de conexión' 
      };
    }
  };

  const restablecerPassword = async (token, nuevaPassword, confirmarPassword) => {
    try {
      const response = await API.post('/auth/restablecer-password', {
        token,
        nuevaPassword,
        confirmarPassword
      });
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        mensaje: error.response?.data?.mensaje || 'Error de conexión' 
      };
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      // Endpoint para refrescar token (implementar si es necesario)
      const response = await API.post('/auth/refresh-token', { refreshToken });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const expiration = Date.now() + (response.data.expiresIn || 86400000);
        localStorage.setItem('tokenExpiration', expiration.toString());
        setTokenExpiration(expiration);
        return true;
      }
    } catch (error) {
      logout();
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      recuperarPassword,
      restablecerPassword,
      refreshToken,
      loading,
      isAuthenticated: !!user,
      tokenExpiration
    }}>
      {children}
    </AuthContext.Provider>
  );
};