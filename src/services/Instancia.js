import API from './api';

const ENDPOINT = "/instancias";

export const getInstancias = async () => {
  const response = await API.get(ENDPOINT);
  return response.data;
};

export const getInstanciaByCodigo = async (codigo) => {
  const response = await API.get(`${ENDPOINT}/${codigo}`);
  return response.data;
};

export const crearInstancia = async (data) => {
  const response = await API.post(ENDPOINT, data);
  return response.data;
};

export const editarInstancia = async (codigo, data) => {
  const response = await API.put(`${ENDPOINT}/${codigo}`, data);
  return response.data;
};

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
