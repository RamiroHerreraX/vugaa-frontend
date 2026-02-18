// src/services/expediente.js
import API from './api';

export const getMiExpediente = async () => {
  try {
    const response = await API.get('/expedientes/mi-expediente');
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener expediente' };
  }
};

export const getCertificaciones = async (expedienteId) => {
  try {
    const response = await API.get(`/expedientes/${expedienteId}/certificados`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener certificaciones' };
  }
};