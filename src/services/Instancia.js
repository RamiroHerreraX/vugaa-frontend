import API from './api';

const ENDPOINT = "/instancias";

// ========================================
// LISTAR TODAS
// ========================================
export const getInstancias = async () => {
  const response = await API.get(ENDPOINT);
  return response.data;
};

// ========================================
// OBTENER POR CODIGO
// ========================================
export const getInstanciaByCodigo = async (codigo) => {
  const response = await API.get(`${ENDPOINT}/${codigo}`);
  return response.data;
};

// ========================================
// CREAR
// ========================================
export const crearInstancia = async (data) => {
  const response = await API.post(ENDPOINT, data);
  return response.data;
};

// ========================================
// EDITAR
// ========================================
export const editarInstancia = async (codigo, data) => {
  const response = await API.put(`${ENDPOINT}/${codigo}`, data);
  return response.data;
};

// ========================================
// ACTIVAR / DESACTIVAR
// ========================================
export const cambiarEstadoInstancia = async (codigo, activa) => {
  const response = await API.patch(
    `${ENDPOINT}/${codigo}/estado`,
    null,
    {
      params: { activa }
    }
  );
  return response.data;
};