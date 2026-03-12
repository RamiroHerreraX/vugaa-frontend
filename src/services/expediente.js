// src/services/expediente.js
import API from './api';

export const getMiExpediente = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await API.get('/expedientes/mi-expediente', {
    params: {
      usuarioId: user.id,
      instanciaId: user.instanciaId
    }
  });
  return response.data;
};


export const getCertificaciones = async (expedienteId) => {
  try {
    const response = await API.get(`/expedientes/${expedienteId}/certificados`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener certificaciones' };
  }
};



export const getExpedienteByUsuarioId = async (usuarioId) => {
  try {
    // Obtenemos el usuario autenticado para la instancia
    const user = JSON.parse(localStorage.getItem('user'));
    
    const response = await API.get('/expedientes/mi-expediente', {
      params: {
        usuarioId: usuarioId,
        instanciaId: user.instanciaId // Usamos la misma instancia del usuario logueado
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener expediente por usuario ID:', error);
    throw error.response?.data || { mensaje: 'Error al obtener expediente del usuario' };
  }
};


export const getExpedienteByUsuarioEInstancia = async (usuarioId, instanciaId) => {
  try {
    console.log('🔍 Buscando expediente para:', { usuarioId, instanciaId });
    
    const response = await API.get('/expedientes/mi-expediente', {
      params: {
        usuarioId: usuarioId,
        instanciaId: instanciaId
      }
    });
    
    console.log('📥 Expediente encontrado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener expediente:', error);
    throw error.response?.data || { mensaje: 'Error al obtener expediente del usuario' };
  }
};




