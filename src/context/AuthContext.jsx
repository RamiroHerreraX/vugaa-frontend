import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiration, setTokenExpiration] = useState(null);

  const performLocalLogout = useCallback((redirect = true) => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('tenant'); // ✅ Limpiar el tenant al cerrar sesión

    setUser(null);
    setTokenExpiration(null);

    delete API.defaults.headers.common['Authorization'];

    if (redirect) {
      window.location.href = '/login';
    }
  }, []);

  // Verificar token periódicamente
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        await API.get('/auth/verificar-token');
      } catch (error) {
        if (error.response?.status !== 401) {
          performLocalLogout(false);
        }
      }
    };

    const interval = setInterval(checkToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [performLocalLogout]);

  const loadUser = useCallback(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const expiration = localStorage.getItem('tokenExpiration');

    if (token && userStr && expiration) {
      if (Date.now() > parseInt(expiration)) {
        performLocalLogout(false);
      } else {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setTokenExpiration(parseInt(expiration));
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error('Error parsing user data', error);
          performLocalLogout(false);
        }
      }
    }
    setLoading(false);
  }, [performLocalLogout]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const updateUser = (campos) => {
    const updatedUser = { ...user, ...campos };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

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
        const roleMap = {
          'SUPERADMIN': 'supera',
          'ADMIN': 'admin',
          'COMITE': 'comite',
          'ASOCIACION': 'asociacion',
          'AGENTE': 'agente',
          'PROFESIONISTA': 'profesionista',
          'EMPRESARIO': 'empresario'
        };

        const userData = {
          id: response.data.id,
          email: response.data.email,
          nombre: response.data.nombre,
          rol: roleMap[response.data.rol] || response.data.rol.toLowerCase(),
          instanciaId: response.data.instanciaId,
          instanciaNombre: response.data.instanciaNombre,
          perfilCompleto: response.data.perfilCompleto ?? false
        };

        const expiration = Date.now() + (response.data.expiresIn || 86400000);

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken || '');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('tokenExpiration', expiration.toString());
        localStorage.setItem('tenant', tenant); // ✅ Guardar el tenant con el que inició sesión

        API.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        setUser(userData);
        setTokenExpiration(expiration);

        console.log(`Login exitoso para: ${userData.nombre} (tenant: ${tenant})`);
        return { success: true, user: userData };
      } else {
        return { success: false, error: response.data.mensaje || 'Error al iniciar sesión' };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.mensaje || 'Error de conexión';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async (options = {}) => {
    const { redirect = true } = options;

    try {
      const token = localStorage.getItem('token');

      if (token) {
        await API.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000
        }).catch(error => {
          console.log('Error en logout del backend (ignorado):', error.message);
        });
      }
    } catch (error) {
      console.error('Error inesperado en logout:', error);
    } finally {
      performLocalLogout(redirect);
    }
  };

  const recuperarPassword = async (email) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/recuperar-password', { email });
      return {
        success: true,
        mensaje: response.data.mensaje || 'Si el email existe, recibirás instrucciones'
      };
    } catch (error) {
      return {
        success: true,
        mensaje: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
      };
    } finally {
      setLoading(false);
    }
  };

  const restablecerPassword = async (token, nuevaPassword, confirmarPassword) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/restablecer-password', {
        token,
        nuevaPassword,
        confirmarPassword
      });
      return {
        success: true,
        mensaje: response.data.mensaje || 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        mensaje: error.response?.data?.mensaje || 'Error al restablecer la contraseña'
      };
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await API.post('/auth/refresh-token', { refreshToken });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const expiration = Date.now() + (response.data.expiresIn || 86400000);
        localStorage.setItem('tokenExpiration', expiration.toString());
        setTokenExpiration(expiration);
        API.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return true;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      performLocalLogout(true);
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
      tokenExpiration,
      perfilIncompleto: user ? !user.perfilCompleto : false,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};