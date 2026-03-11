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
// 🔹 TOGGLE ESTADO DOCUMENTO (ACTIVAR/DESACTIVAR)
// ========================================
export const toggleEstadoDocumento = async (id) => {
  const response = await API.delete(`${ENDPOINT}/${id}`);
  return response.data; // Ahora devuelve el documento con el estado actualizado
};

// Mantenemos el alias para compatibilidad
export const eliminarDocumento = toggleEstadoDocumento;

// ========================================
// 🔹 CREAR DOCUMENTO PLANTILLA (SUPERADMIN)
// ========================================
export const crearDocumentoPlantilla = async (data) => {
  const response = await API.post(`${ENDPOINT}/plantilla`, data);
  return response.data;
};

// ========================================
// 🔹 CREAR DOCUMENTO PLANTILLA PARA ADMIN (NUEVO)
// ========================================
export const crearDocumentoPlantillaParaAdmin = async (data) => {
  const response = await API.post(`${ENDPOINT}/plantilla-admin`, data);
  return response.data;
};

// ========================================
// 🔹 ACTUALIZAR SOLO REQUIERE_VALIDACION
// ========================================
export const actualizarRequiereValidacion = async (idDocumento, requiereValidacion) => {
  const response = await API.patch(
    `${ENDPOINT}/${idDocumento}/requiere-validacion`,
    null, // PATCH no envía body completo, solo params
    { params: { requiereValidacion } }
  );
  return response.data;
};

// ========================================
// 🔹 LISTAR POR EXPEDIENTE (SOLO ACTIVOS)
// ========================================
export const getDocumentosPorExpedienteActivos = async (idExpediente) => {
  const response = await API.get(`${ENDPOINT}/expediente/${idExpediente}/activos`);
  return response.data;
};

// ========================================
// 🔹 LISTAR POR APARTADO (SOLO ACTIVOS)
// ========================================
export const getDocumentosPorApartadoActivos = async (idApartado) => {
  const response = await API.get(`${ENDPOINT}/apartado/${idApartado}/activos`);
  return response.data;
};

// ========================================
// 🔹 LISTAR POR INSTANCIA (SOLO ACTIVOS)
// ========================================
export const getDocumentosPorInstanciaActivos = async (idInstancia) => {
  const response = await API.get(`${ENDPOINT}/instancia/${idInstancia}/activos`);
  return response.data;
};