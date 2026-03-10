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



