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
//  LISTAR POR APARTADO (SOLO ACTIVOS)
// ========================================
export const getProgramasPorApartadoActivos = async (idApartado) => {
  const response = await API.get(`${ENDPOINT}/apartado/${idApartado}/activos`);
  return response.data;
};

// 🆕 NUEVO MÉTODO: LISTAR PROGRAMAS GLOBALES + DE UNA INSTANCIA ESPECÍFICA
// ========================================
export const getProgramasGlobalesYPorInstancia = async (idInstancia) => {
  const response = await API.get(`${ENDPOINT}/combinado/${idInstancia}`);
  return response.data;
};

// ========================================
// 🔹 CAMBIAR ESTADO (ACTIVAR/DESACTIVAR)
// ========================================
export const cambiarEstadoPrograma = async (idPrograma, activo) => {
  await API.patch(`${ENDPOINT}/${idPrograma}/estado?activo=${activo}`);
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