import API from "./api";

// ========================================
// 🔹 DOCUMENTOS SUBIDOS POR AGENTE
// ========================================
const ENDPOINT_SUBIDOS = "/documentos-subidos";

// Subir un documento
export const subirDocumento = async (data, archivo) => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('dto', new Blob([JSON.stringify(data)], { 
    type: 'application/json' 
  }));

  const response = await API.post(ENDPOINT_SUBIDOS, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};


// Obtener documentos subidos de un expediente filtrados por apartado
export const getDocumentosSubidosPorApartado = async (idExpediente, idApartado) => {
  const response = await API.get(
    `${ENDPOINT_SUBIDOS}/expediente/${idExpediente}/apartado/${idApartado}`
  );
  return response.data;
};



// Eliminación lógica de un documento subido
export const eliminarDocumentoSubido = async (idDocumentoSubido) => {
  const response = await API.delete(`${ENDPOINT_SUBIDOS}/${idDocumentoSubido}`);
  return response.data;
};

export const descargarArchivo = async (idDocumentoSubido, nombreArchivo) => {
  const response = await API.get(
    `${ENDPOINT_SUBIDOS}/${idDocumentoSubido}/descargar`,
    { responseType: 'blob' }
  );

  // Crear link temporal y disparar descarga
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', nombreArchivo);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const obtenerArchivoBlob = async (idDocumentoSubido) => {
  const response = await API.get(
    `${ENDPOINT_SUBIDOS}/${idDocumentoSubido}/descargar`,
    { responseType: 'blob' }
  );
  return response.data; // solo retorna el blob, sin descargar
};