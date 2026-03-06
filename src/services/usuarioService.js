import API from "./api";

class UsuarioService {
  async findAll() {
    try {
      const response = await API.get("/usuarios");
      return response.data;
    } catch (error) {
      console.error("Error en findAll:", error);
      throw error.response?.data || { error: "Error al obtener usuarios" };
    }
  }

  async findById(id) {
    try {
      const response = await API.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en findById:", error);
      throw error.response?.data || { error: "Usuario no encontrado" };
    }
  }

  async create(usuarioDTO) {
    try {
      console.log("Creando usuario con datos:", JSON.stringify(usuarioDTO));
      const response = await API.post("/usuarios", usuarioDTO);
      return response.data;
    } catch (error) {
      console.error("Error en create:", error);
      throw error.response?.data || { error: "Error al crear el usuario" };
    }
  }

  async update(id, usuarioDTO) {
    try {
      console.log(`Actualizando usuario ID ${id}:`, JSON.stringify(usuarioDTO));
      const response = await API.put(`/usuarios/${id}`, usuarioDTO);
      return response.data;
    } catch (error) {
      console.error("Error en update:", error);
      throw error.response?.data || { error: "Error al actualizar el usuario" };
    }
  }

  async cambiarEstadoActivo(id, activo) {
    try {
      const response = await API.patch(`/usuarios/${id}/estado`, null, {
        params: { activo },
      });
      return response.data;
    } catch (error) {
      console.error("Error en cambiarEstadoActivo:", error);
      throw (
        error.response?.data || {
          error: "Error al cambiar el estado del usuario",
        }
      );
    }
  }

  async findAllForTable() {
    try {
      const response = await API.get("/usuarios/tabla");
      return response.data;
    } catch (error) {
      console.error("Error en findAllForTable:", error);
      throw (
        error.response?.data || {
          error: "Error al obtener usuarios para la tabla",
        }
      );
    }
  }

  async findByIdForTable(id) {
    try {
      const response = await API.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en findByIdForTable:", error);
      throw error.response?.data || { error: "Usuario no encontrado" };
    }
  }

  formatUltimoAcceso(ultimoAcceso) {
    if (!ultimoAcceso) return "Nunca";
    try {
      const fecha = new Date(ultimoAcceso);
      const ahora = new Date();
      const diffHoras = Math.floor((ahora - fecha) / (1000 * 60 * 60));
      if (diffHoras < 1) {
        const diffMinutos = Math.floor((ahora - fecha) / (1000 * 60));
        return diffMinutos < 1
          ? "Hace unos segundos"
          : `Hace ${diffMinutos} minutos`;
      }
      if (diffHoras < 24) return `Hace ${diffHoras} horas`;
      if (diffHoras < 48) return "Ayer";
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  }

  getEstadoClass(estado) {
    switch (estado?.toLowerCase()) {
      case "activo":
        return "badge-success";
      case "inactivo":
        return "badge-warning";
      case "bloqueado":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  }

  getEstadoTexto(estado) {
    switch (estado?.toLowerCase()) {
      case "activo":
        return "Activo";
      case "inactivo":
        return "Inactivo";
      case "bloqueado":
        return "Bloqueado";
      default:
        return "Desconocido";
    }
  }
  async findAgrupadosPorInstancia() {
    try {
      const response = await API.get("/usuarios/agrupados");
      return response.data; // Esto será un objeto { instanciaId: [usuarios...] }
    } catch (error) {
      console.error("Error en findAgrupadosPorInstancia:", error);
      throw (
        error.response?.data || {
          error: "Error al obtener usuarios agrupados por instancia",
        }
      );
    }
  }
  async cambiarInstancia(id, instanciaId) {
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
  }

  /**
   * NUEVO MÉTODO: Obtiene todos los usuarios de una instancia específica
   * @param {number} instanciaId - ID de la instancia
   * @returns {Promise<Array>} Lista de usuarios de la instancia en formato UsuarioTablaDTO
   */
  async findByInstanciaId(instanciaId) {
    try {
      console.log(`Obteniendo usuarios para instancia ID: ${instanciaId}`);
      const response = await API.get(`/usuarios/instancia/${instanciaId}`);
      return response.data;
    } catch (error) {
      console.error("Error en findByInstanciaId:", error);
      throw (
        error.response?.data || {
          error: "Error al obtener usuarios por instancia",
        }
      );
    }
  }

  async findAsociacionByInstanciaId(instanciaId) {
    try {
      const response = await API.get(
        `/usuarios/asociacion/instancia/${instanciaId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error en findAsociacionByInstanciaId:", error);
      throw (
        error.response?.data || {
          error: "Error al obtener usuarios de asociación por instancia",
        }
      );
    }
  }

  async findAgrupadosPorInstancia() {
    try {
      const response = await API.get("/usuarios/agrupados");
      return response.data; // Esto será un objeto { instanciaId: [usuarios...] }
    } catch (error) {
      console.error("Error en findAgrupadosPorInstancia:", error);
      throw (
        error.response?.data || {
          error: "Error al obtener usuarios agrupados por instancia",
        }
      );
    }
  }


  async completarPerfil(usuarioId, instanciaId, perfilData) {
  try {
    const response = await API.post(
      `/perfil-agente/${usuarioId}/completar`,
      perfilData,
      { params: { instanciaId } }
    );
    return response.data;
  } catch (error) {
    console.error('Error en completarPerfil:', error);
    throw error.response?.data || { error: 'Error al completar el perfil' };
  }
}

async obtenerPerfilAgente(usuarioId) {
  try {
    const response = await API.get(`/perfil-agente/${usuarioId}`);
    return response.data;
  } catch (error) {
    // 404 significa que aún no tiene perfil — es normal para usuarios nuevos
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error en obtenerPerfilAgente:', error);
    return null;
  }
}

 // Usuarios SIN asociación (para invitar)
  async findUsuariosSinAsociacion(instanciaId) {
    try {
      const response = await API.get(
        `/usuarios/asociacion/sin-asociacion/${instanciaId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error en findUsuariosSinAsociacion:", error);
      throw (
        error.response?.data || {
          error: "Error al obtener usuarios sin asociación",
        }
      );
    }
  }

  // Usuarios que pertenecen a MI asociación
  async findUsuariosDeMiAsociacion(idAsociacion) {
    try {
      const response = await API.get(
        `/usuarios/asociacion/mia/${idAsociacion}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error en findUsuariosDeMiAsociacion:", error);
      throw (
        error.response?.data || {
          error: "Error al obtener usuarios de mi asociación",
        }
      );
    }
  }

  // Usuarios de mi asociación que me dieron permiso para subir documentos
  async findUsuariosConPermisoDocumentos(idAsociacion) {
    try {
      const response = await API.get(
        `/usuarios/asociacion/con-permiso/${idAsociacion}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error en findUsuariosConPermisoDocumentos:", error);
      throw (
        error.response?.data || {
          error: "Error al obtener usuarios con permiso",
        }
      );
    }
  }

  // Agregar o quitar usuario de una asociación
  async actualizarAsociacionUsuario(usuarioId, asociacionId) {
    try {
      const response = await API.put(`/usuarios/${usuarioId}/asociacion`, {
        asociacionId: asociacionId,
      });

      return response.data;
    } catch (error) {
      console.error("Error en actualizarAsociacionUsuario:", error);
      throw (
        error.response?.data || {
          error: "Error al actualizar la asociación del usuario",
        }
      );
    }
  }
  async quitarAsociacionUsuario(usuarioId) {
    try {
      const response = await API.put(
        `/usuarios/${usuarioId}/quitar-asociacion`,
      );
      return response.data;
    } catch (error) {
      console.error("Error al quitar asociación:", error);
      throw error.response?.data || { error: "Error al quitar asociación" };
    }
  }

}


 

export default new UsuarioService();
