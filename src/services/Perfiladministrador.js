import API from "./api";

const ENDPOINT = "/perfil-administrador";

// ========================================
// 🔹 CREAR
// ========================================
export const crearPerfilAdministrador = async (data) => {
  const response = await API.post(ENDPOINT, data);
  return response.data;
};

// ========================================
// 🔹 ACTUALIZAR
// ========================================
export const editarPerfilAdministrador = async (idUsuario, data) => {
  const response = await API.put(`${ENDPOINT}/${idUsuario}`, data);
  return response.data;
};

// ========================================
// 🔹 OBTENER POR USUARIO
// ========================================
export const getPerfilAdministradorPorUsuario = async (idUsuario) => {
  const response = await API.get(`${ENDPOINT}/usuario/${idUsuario}`);
  return response.data;
};

// ========================================
// 🔹 OBTENER POR NÚMERO DE EMPLEADO
// ========================================
export const getPerfilAdministradorPorNumeroEmpleado = async (numeroEmpleado) => {
  const response = await API.get(`${ENDPOINT}/empleado/${numeroEmpleado}`);
  return response.data;
};

// ========================================
// 🔹 LISTAR TODOS
// ========================================
export const getTodosPerfilesAdministrador = async () => {
  const response = await API.get(ENDPOINT);
  return response.data;
};

// ========================================
// 🔹 LISTAR POR TIPO (SUPERADMIN | ADMIN)
// ========================================
export const getPerfilesAdministradorPorTipo = async (tipoAdmin) => {
  const response = await API.get(`${ENDPOINT}/tipo/${tipoAdmin}`);
  return response.data;
};

// ========================================
// 🔹 ELIMINAR
// ========================================
export const eliminarPerfilAdministrador = async (idUsuario) => {
  await API.delete(`${ENDPOINT}/${idUsuario}`);
};