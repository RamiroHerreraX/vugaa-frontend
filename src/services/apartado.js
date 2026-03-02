import API from "./api";

const ENDPOINT = "/apartados";

// ========================================
// 🔹 CREAR
// ========================================
export const crearApartado = async (data) => {
  const response = await API.post(ENDPOINT, data);
  return response.data;
};

// ========================================
// 🔹 ACTUALIZAR
// ========================================
export const editarApartado = async (id, data) => {
  const response = await API.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// ========================================
// 🔹 LISTAR POR INSTANCIA
// ========================================
export const getApartadosPorInstancia = async (idInstancia) => {
  const response = await API.get(`${ENDPOINT}/instancia/${idInstancia}`);
  return response.data;
};

// ========================================
// 🔹 DESACTIVAR (ELIMINACIÓN LÓGICA)
// ========================================
export const desactivarApartado = async (id) => {
  await API.delete(`${ENDPOINT}/${id}`);
};