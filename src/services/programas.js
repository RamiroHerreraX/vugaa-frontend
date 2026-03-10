import API from "./api";

const ENDPOINT = "/programas";

// ========================================
// 🔹 CREAR PROGRAMA NORMAL
// ========================================
export const crearPrograma = async (data) => {
  const response = await API.post(ENDPOINT, data);
  return response.data;
};

// ========================================
// 🔹 CREAR PROGRAMA GLOBAL
// ========================================
export const crearProgramaGlobal = async (data) => {
  const response = await API.post(`${ENDPOINT}/global`, data);
  return response.data;
};

// ========================================
// 🔹 ACTUALIZAR PROGRAMA NORMAL
// ========================================
export const editarPrograma = async (idPrograma, data) => {
  const response = await API.put(`${ENDPOINT}/${idPrograma}`, data);
  return response.data;
};

// ========================================
// 🔹 ACTUALIZAR PROGRAMA GLOBAL
// ========================================
export const editarProgramaGlobal = async (idPrograma, data) => {
  const response = await API.put(`${ENDPOINT}/global/${idPrograma}`, data);
  return response.data;
};

// ========================================
// 🔹 OBTENER POR ID
// ========================================
export const getProgramaPorId = async (idPrograma) => {
  const response = await API.get(`${ENDPOINT}/${idPrograma}`);
  return response.data;
};

// ========================================
// 🔹 LISTAR POR INSTANCIA
// ========================================
export const getProgramasPorInstancia = async (idInstancia) => {
  const response = await API.get(`${ENDPOINT}/instancia/${idInstancia}`);
  return response.data;
};

// ========================================
// 🔹 LISTAR POR APARTADO
// ========================================
export const getProgramasPorApartado = async (idApartado) => {
  const response = await API.get(`${ENDPOINT}/apartado/${idApartado}`);
  return response.data;
};

// ========================================
// 🔹 ELIMINAR (SOFT DELETE)
// ========================================
export const eliminarPrograma = async (idPrograma) => {
  await API.delete(`${ENDPOINT}/${idPrograma}`);
};

// ========================================
// 🆕 ACTIVAR / DESACTIVAR PROGRAMA GLOBAL
// ========================================
export const cambiarEstadoProgramaGlobal = async (idPrograma, activo) => {
  const response = await API.patch(
    `${ENDPOINT}/global/${idPrograma}/estado?activo=${activo}`
  );
  return response.data;
};