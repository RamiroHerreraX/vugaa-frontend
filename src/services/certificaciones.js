import API from "./api";
const ENDPOINT = "/certificaciones";

export const getCertificacionesPorExpediente = async (idExpediente) => {
  const response = await API.get(`${ENDPOINT}/expediente/${idExpediente}`);
  return response.data;
};

export const crearCertificacionCompleta = async (
  formData, idInstancia, idExpediente, idPrograma, archivo
) => {
  const dto = {
    idInstancia,
    idPrograma,
    idExpediente,
    nombre:       formData.nombre,
    institucion:  formData.institucion,
    horas:        parseInt(formData.horas),
    fechaEmision: formData.fecha,
    nombreArchivo: formData.nombreArchivo,
    descripcion:  formData.descripcion ?? '',
  };

  const form = new FormData();
  form.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
  form.append('archivo', archivo);

  const response = await API.post(`${ENDPOINT}/completa`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};

export const editarCertificacionCompleta = async (data) => {
  const response = await API.put(`${ENDPOINT}/completa`, data);
  return response.data;
};



export const obtenerArchivoBlobCertificacion = async (idCertExp) => {
  const response = await API.get(
    `certificaciones/${idCertExp}/archivo`,
    { responseType: 'blob' }
  );
  return response.data;
};

export const descargarArchivoCertificacion = async (idCertExp, nombreArchivo) => {
  const response = await API.get(
    `certificaciones/${idCertExp}/archivo`,
    { responseType: 'blob' }
  );
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', nombreArchivo);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const eliminarCertificacionCompleta = async (idCertExp, idCertificacion) => {
  const response = await API.post(`/certificaciones/completa/eliminar`, {
    idCertExp,
    idCertificacion
  });
  return response.data;
};