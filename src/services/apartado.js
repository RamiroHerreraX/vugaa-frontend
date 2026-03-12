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
  // 🔹 CAMBIAR ESTADO (ACTIVAR/DESACTIVAR)
  // ========================================
  export const cambiarEstadoApartado = async (id, activo) => {
    await API.patch(`${ENDPOINT}/${id}/estado`, null, {
      params: { activo }
    });
  };

  // ========================================
  // 🔹 LISTAR TODOS (SIN INSTANCIA)
  // ========================================
  export const getTodosApartados = async () => {
    const response = await API.get(ENDPOINT); // ✅ coincide con backend
    return response.data;
  };

  // ========================================
  // 🔹 CREAR GLOBAL (SIN INSTANCIA)
  // ========================================
  export const crearApartadoGlobal = async (data) => {
    const response = await API.post(`${ENDPOINT}/global`, data);
    return response.data;
  };


  // ========================================
  // 🔹 ACTUALIZAR GLOBAL (SIN INSTANCIA)
  // ========================================
  export const editarApartadoGlobal = async (id, data) => {
    const response = await API.put(`${ENDPOINT}/global/${id}`, data);
    return response.data;
  };


  // ========================================
  // 🔥 NUEVO: LISTAR POR INSTANCIA + GLOBALES
  // ========================================
  export const getApartadosPorInstanciaConGlobales = async (idInstancia) => {
    const response = await API.get(`${ENDPOINT}/instancia/${idInstancia}/combinados`);
    return response.data;
  };


  // ========================================
  // 🆕 LISTAR SOLO GLOBALES
  // ========================================
  export const getApartadosGlobales = async () => {
    const response = await API.get(`${ENDPOINT}/globales`);
    return response.data;
  };

  // ========================================
  // 🆕 ACTIVAR / DESACTIVAR GLOBAL
  // ========================================
  export const cambiarEstadoApartadoGlobal = async (id, activo) => {
    const response = await API.patch(
      `${ENDPOINT}/global/${id}/estado?activo=${activo}`
    );
    return response.data;
  };


// ========================================
// 🆕 NUEVO: LISTAR POR ROL (ASOCIACION)
// trae activos + instancia enviada + globales
// ========================================
export const getApartadosPorRol = async (rol, idInstancia) => {
  const response = await API.get(`${ENDPOINT}/rol/${rol}`, {
    params: { idInstancia }
  });
  return response.data;
};