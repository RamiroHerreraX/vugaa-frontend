// src/services/asociacionService.js
import API from "./api";

class AsociacionService {
  // ===== CRUD BÁSICO =====

  async findAll() {
    try {
      const response = await API.get("/asociaciones");
      console.log("Respuesta exitosa:", response);
      return response.data;
    } catch (error) {
      console.error("ERROR COMPLETO:", {
        message: error.message,
        config: error.config,
        response: error.response,
        baseURL: API.defaults.baseURL,
        url: error.config?.url,
      });
      throw this._handleError(error);
    }
  }

  async findById(id) {
    try {
      console.log(`Buscando asociación por ID: ${id}`);
      console.log(
        "URL completa:",
        API.defaults.baseURL + `/asociaciones/${id}`,
      );

      const response = await API.get(`/asociaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error en findById ${id}:`, error);
      throw this._handleError(error);
    }
  }

  async listarUsuariosAsociacionPorInstancia(instanciaId) {
    try {
      console.log(
        `Listando usuarios de asociación para instancia: ${instanciaId}`,
      );
      console.log(
        "URL completa:",
        API.defaults.baseURL + `/usuarios/asociacion/instancia/${instanciaId}`,
      );

      const response = await API.get(
        `/usuarios/asociacion/instancia/${instanciaId}`,
      );
      console.log("Usuarios de asociación obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Error al listar usuarios de asociación para instancia ${instanciaId}:`,
        error,
      );
      throw this._handleError(error);
    }
  }

  async create(asociacionDTO) {
    try {
      console.log("Creando asociación:", asociacionDTO);
      console.log("URL completa:", API.defaults.baseURL + "/asociaciones");

      const response = await API.post("/asociaciones", asociacionDTO);
      return response.data;
    } catch (error) {
      console.error("Error en create:", error);
      throw this._handleError(error);
    }
  }

  async update(id, asociacionDTO) {
    try {
      console.log(`Actualizando asociación ${id}:`, asociacionDTO);
      console.log(
        "URL completa:",
        API.defaults.baseURL + `/asociaciones/${id}`,
      );

      const response = await API.put(`/asociaciones/${id}`, asociacionDTO);
      return response.data;
    } catch (error) {
      console.error("Error en update:", error);
      throw this._handleError(error);
    }
  }

  async delete(id) {
    try {
      console.log(`Eliminando asociación ${id}`);
      console.log(
        "URL completa:",
        API.defaults.baseURL + `/asociaciones/${id}`,
      );

      const response = await API.delete(`/asociaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en delete:", error);
      throw this._handleError(error);
    }
  }

  // ===== OPERACIONES DE ESTADO =====

  async activar(id) {
    try {
      console.log(`Activando asociación ${id}`);
      console.log(
        "URL completa:",
        API.defaults.baseURL + `/asociaciones/${id}/activar`,
      );

      const response = await API.patch(`/asociaciones/${id}/activar`);
      return response.data;
    } catch (error) {
      console.error("Error en activar:", error);
      throw this._handleError(error);
    }
  }

  async desactivar(id) {
    try {
      console.log(`Desactivando asociación ${id}`);
      console.log(
        "URL completa:",
        API.defaults.baseURL + `/asociaciones/${id}/desactivar`,
      );

      const response = await API.patch(`/asociaciones/${id}/desactivar`);
      return response.data;
    } catch (error) {
      console.error("Error en desactivar:", error);
      throw this._handleError(error);
    }
  }

  // ===== NUEVOS MÉTODOS PARA RELACIÓN USUARIO-ASOCIACIÓN =====

  /**
   * Relaciona un usuario con una asociación
   * @param {number} idAsociacion - ID de la asociación
   * @param {number} idUsuario - ID del usuario a relacionar
   * @returns {Promise} - Respuesta con la asociación actualizada
   */
  async relacionarUsuario(idAsociacion, idUsuario) {
    try {
      console.log(
        `Relacionando usuario ${idUsuario} con asociación ${idAsociacion}`,
      );
      console.log(
        "URL completa:",
        API.defaults.baseURL +
          `/asociaciones/${idAsociacion}/usuarios/${idUsuario}`,
      );

      const response = await API.post(
        `/asociaciones/${idAsociacion}/usuarios/${idUsuario}`,
      );
      console.log("Usuario relacionado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Error al relacionar usuario ${idUsuario} con asociación ${idAsociacion}:`,
        error,
      );
      throw this._handleError(error);
    }
  }

  /**
   * Desvincula un usuario de una asociación
   * @param {number} idAsociacion - ID de la asociación
   * @param {number} idUsuario - ID del usuario a desvincular
   * @returns {Promise} - Respuesta con la asociación actualizada
   */
  async desvincularUsuario(idAsociacion, idUsuario) {
    try {
      console.log(
        `Desvinculando usuario ${idUsuario} de asociación ${idAsociacion}`,
      );
      console.log(
        "URL completa:",
        API.defaults.baseURL +
          `/asociaciones/${idAsociacion}/usuarios/${idUsuario}`,
      );

      const response = await API.delete(
        `/asociaciones/${idAsociacion}/usuarios/${idUsuario}`,
      );
      console.log("Usuario desvinculado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Error al desvincular usuario ${idUsuario} de asociación ${idAsociacion}:`,
        error,
      );
      throw this._handleError(error);
    }
  }

  // ===== BÚSQUEDAS =====

  async findActivas() {
    try {
      console.log("Buscando asociaciones activas");
      console.log(
        "URL completa:",
        API.defaults.baseURL + "/asociaciones/activas",
      );

      const response = await API.get("/asociaciones/activas");
      return response.data;
    } catch (error) {
      console.error("Error en findActivas:", error);
      throw this._handleError(error);
    }
  }

  async findInactivas() {
    try {
      console.log("Buscando asociaciones inactivas");
      console.log(
        "URL completa:",
        API.defaults.baseURL + "/asociaciones/inactivas",
      );

      const response = await API.get("/asociaciones/inactivas");
      return response.data;
    } catch (error) {
      console.error("Error en findInactivas:", error);
      throw this._handleError(error);
    }
  }

  async buscarPorTermino(termino) {
    try {
      console.log(`Buscando asociaciones con término: ${termino}`);
      console.log(
        "URL completa:",
        API.defaults.baseURL + "/asociaciones/buscar?q=" + termino,
      );

      const response = await API.get("/asociaciones/buscar", {
        params: { q: termino },
      });
      return response.data;
    } catch (error) {
      console.error("Error en buscarPorTermino:", error);
      throw this._handleError(error);
    }
  }

  // ===== VALIDACIONES =====

  async existsByNombre(nombre) {
    try {
      console.log(`Verificando si existe nombre: ${nombre}`);
      console.log(
        "URL completa:",
        API.defaults.baseURL +
          "/asociaciones/existe/nombre?nombre=" +
          encodeURIComponent(nombre),
      );

      const response = await API.get("/asociaciones/existe/nombre", {
        params: { nombre },
      });
      return response.data.exists;
    } catch (error) {
      console.error("Error en existsByNombre:", error);
      throw this._handleError(error);
    }
  }

  async existsByCif(cif) {
    try {
      console.log(`Verificando si existe CIF: ${cif}`);
      console.log(
        "URL completa:",
        API.defaults.baseURL +
          "/asociaciones/existe/cif?cif=" +
          encodeURIComponent(cif),
      );

      const response = await API.get("/asociaciones/existe/cif", {
        params: { cif },
      });
      return response.data.exists;
    } catch (error) {
      console.error("Error en existsByCif:", error);
      throw this._handleError(error);
    }
  }

  async findByUsuarioId(idUsuario) {
    try {
      console.log(`Buscando asociación del usuario: ${idUsuario}`);
      console.log(
        "URL completa:",
        API.defaults.baseURL + `/asociaciones/usuario/${idUsuario}`,
      );

      const response = await API.get(`/asociaciones/usuario/${idUsuario}`);
      console.log("Asociación encontrada:", response.data);

      return response.data;
    } catch (error) {
      console.error(
        `Error al obtener asociación del usuario ${idUsuario}:`,
        error,
      );
      throw this._handleError(error);
    }
  }

  // ===== MANEJADOR DE ERRORES =====

  _handleError(error) {
    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data, config } = error.response;

      let message = `Error ${status}: `;

      if (data) {
        if (data.error) message += data.error;
        else if (data.message) message += data.message;
        else if (data.mensaje) message += data.mensaje;
        else message += "Error en el servidor";
      }

      // Información adicional para depuración
      console.error("Detalles del error:", {
        url: config?.url,
        method: config?.method,
        baseURL: config?.baseURL,
        status,
        data,
      });

      return new Error(message);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error("No se recibió respuesta del servidor:", error.request);
      return new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión.",
      );
    } else {
      // Error en la configuración de la petición
      console.error("Error en la configuración:", error.message);
      return new Error("Error al realizar la petición: " + error.message);
    }
  }
  async completarPerfil(id, data) {
    try {
      console.log(`Completando perfil de asociación ${id}:`, data);
      const response = await API.put(
        `/asociaciones/${id}/completar-perfil`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error en completarPerfil:", error);
      throw this._handleError(error);
    }
  }
}

export default new AsociacionService();
