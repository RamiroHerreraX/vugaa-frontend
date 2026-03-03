import API from "./api";

const ENDPOINT = "/documentos-expediente";

// ========================================
// 🔹 CREAR DOCUMENTO
// ========================================
export const crearDocumento = async (data) => {
  const response = await API.post(ENDPOINT, data);
  return response.data;
};

// ========================================
// 🔹 ACTUALIZAR DOCUMENTO
// ========================================
export const editarDocumento = async (idDocumento, data) => {
  const response = await API.put(`${ENDPOINT}/${idDocumento}`, data);
  return response.data;
};

// ========================================
// 🔹 LISTAR POR EXPEDIENTE
// ========================================
export const getDocumentosPorExpediente = async (idExpediente) => {
  const response = await API.get(`${ENDPOINT}/expediente/${idExpediente}`);
  return response.data;
};

// ========================================
// 🔹 LISTAR POR APARTADO
// ========================================
export const getDocumentosPorApartado = async (idApartado) => {
  const response = await API.get(`${ENDPOINT}/apartado/${idApartado}`);
  return response.data;
};

// ========================================
// 🔹 LISTAR POR INSTANCIA
// ========================================
export const getDocumentosPorInstancia = async (idInstancia) => {
  const response = await API.get(`${ENDPOINT}/instancia/${idInstancia}`);
  return response.data;
};

// ========================================
// 🔹 ELIMINAR DOCUMENTO (ELIMINACIÓN LÓGICA)
// ========================================
export const eliminarDocumento = async (idDocumento) => {
  await API.delete(`${ENDPOINT}/${idDocumento}`);
};

export const crearDocumentoPlantilla = async (data) => {
  const response = await API.post(`${ENDPOINT}/plantilla`,data);
  return response.data;
};