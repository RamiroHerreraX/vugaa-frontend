import API from "./api";
const ENDPOINT = "/certificaciones";

export const getCertificacionesPorExpediente = async (idExpediente) => {
  const response = await API.get(`${ENDPOINT}/expediente/${idExpediente}`);
  return response.data;
};

export const crearCertificacionCompleta = async (
  formData, idInstancia, idExpediente, idPrograma, mongoDocumentoId
) => {
  const response = await API.post(`${ENDPOINT}/completa`, {
    idInstancia, idPrograma, idExpediente,
    nombre:          formData.nombre,
    institucion:     formData.institucion,
    horas:           parseInt(formData.horas),
    fechaEmision:    formData.fecha,
    mongoDocumentoId,
    nombreArchivo:   formData.nombreArchivo,
    descripcion:     formData.descripcion ?? '',
  });
  return response.data;
};

export const editarCertificacionCompleta = async (data) => {
  const response = await API.put(`${ENDPOINT}/completa`, data);
  return response.data;
};

export const eliminarCertificacionCompleta = async (idCertExp, idCertificacion) => {
  await API.post(`${ENDPOINT}/completa/eliminar`, { idCertExp, idCertificacion });
};