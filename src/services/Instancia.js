import API from './api';

const ENDPOINT = "/instancias";

// ========================================
// LISTAR TODAS (datos básicos)
// ========================================
export const getInstancias = async () => {
  const response = await API.get(ENDPOINT);
  return response.data;
};

// ========================================
// LISTAR TODAS CON ESTADÍSTICAS (tiempo real)
// ========================================
export const getInstanciasConEstadisticas = async () => {
  const response = await API.get(`${ENDPOINT}/stats`);
  return response.data;
};

// ========================================
// OBTENER POR CODIGO (datos básicos)
// ========================================
export const getInstanciaByCodigo = async (codigo) => {
  const response = await API.get(`${ENDPOINT}/${codigo}`);
  return response.data;
};

// ========================================
// OBTENER POR ID CON ESTADÍSTICAS
// ========================================
export const getInstanciaConEstadisticas = async (id) => {
  const response = await API.get(`${ENDPOINT}/${id}/stats`);
  return response.data;
};

// ========================================
// CREAR
// ========================================
export const crearInstancia = async (data) => {
  const response = await API.post(ENDPOINT, data);
  return response.data;
};

// ========================================
// EDITAR
// ========================================
export const editarInstancia = async (codigo, data) => {
  const response = await API.put(`${ENDPOINT}/${codigo}`, data);
  return response.data;
};

// ========================================
// ACTIVAR / DESACTIVAR
// ========================================
export const cambiarEstadoInstancia = async (id, activa) => {
  const response = await API.patch(
    `${ENDPOINT}/${id}/estado`,
    null,
    {
      params: { activa }
    }
  );
  return response.data;
};

// ========================================
// ACTUALIZAR CONTADORES DE UNA INSTANCIA
// ========================================
export const actualizarContadoresInstancia = async (id) => {
  const response = await API.post(`${ENDPOINT}/${id}/actualizar-contadores`);
  return response.data;
};

// ========================================
// ACTUALIZAR CONTADORES DE TODAS LAS INSTANCIAS
// ========================================
export const actualizarContadoresTodasInstancias = async () => {
  try {
    const instancias = await getInstancias();
    const resultados = await Promise.allSettled(
      instancias.map(instancia => actualizarContadoresInstancia(instancia.id))
    );
    
    const exitos = resultados.filter(r => r.status === 'fulfilled').length;
    const fallos = resultados.filter(r => r.status === 'rejected').length;
    
    console.log(`Contadores actualizados: ${exitos} exitosos, ${fallos} fallidos`);
    return { exitos, fallos, resultados };
  } catch (error) {
    console.error("Error al actualizar contadores de todas las instancias:", error);
    throw error;
  }
};

// ========================================
// CAMBIAR INSTANCIA DE USUARIO
// ========================================
export const cambiarInstanciaUsuario = async (id, instanciaId) => {
  try {
    const response = await API.patch(`/usuarios/${id}/instancia`, null, {
      params: { instanciaId },
    });
    return response.data;
  } catch (error) {
    console.error("Error en cambiarInstancia:", error);
    throw (
      error.response?.data || {
        error: "Error al cambiar la instancia del usuario",
      }
    );
  }
};