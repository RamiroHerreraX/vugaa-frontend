// src/services/notificacionService.js
import API from "./api";

class NotificacionService {

  // Todas las del usuario
  async findByUsuario(idUsuario) {
    try {
      const response = await API.get(`/notificaciones/usuario/${idUsuario}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Solo no leídas
  async findNoLeidas(idUsuario) {
    try {
      const response = await API.get(`/notificaciones/usuario/${idUsuario}/no-leidas`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Conteo no leídas
  async countNoLeidas(idUsuario) {
    try {
      const response = await API.get(`/notificaciones/usuario/${idUsuario}/count`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Por usuario e instancia
  async findByUsuarioYInstancia(idUsuario, idInstancia) {
    try {
      const response = await API.get(`/notificaciones/usuario/${idUsuario}/instancia/${idInstancia}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Por tipo
  async findByTipo(idUsuario, tipo) {
    try {
      const response = await API.get(`/notificaciones/usuario/${idUsuario}/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Por instancia (admin)
  async findByInstancia(idInstancia) {
    try {
      const response = await API.get(`/notificaciones/instancia/${idInstancia}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Crear
  async crear(dto) {
    try {
      const response = await API.post("/notificaciones", dto);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Marcar una como leída
  async marcarLeida(id) {
    try {
      const response = await API.patch(`/notificaciones/${id}/leida`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Marcar todas como leídas
  async marcarTodasLeidas(idUsuario) {
    try {
      const response = await API.patch(`/notificaciones/usuario/${idUsuario}/marcar-todas-leidas`);
      return response.data; // { actualizadas: N }
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Marcar todas leídas por instancia
  async marcarTodasLeidasPorInstancia(idUsuario, idInstancia) {
    try {
      const response = await API.patch(
        `/notificaciones/usuario/${idUsuario}/instancia/${idInstancia}/marcar-todas-leidas`
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Eliminar leídas
  async eliminarLeidas(idUsuario) {
    try {
      const response = await API.delete(`/notificaciones/usuario/${idUsuario}/leidas`);
      return response.data; // { eliminadas: N }
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Eliminar una
  async eliminarById(id) {
    try {
      await API.delete(`/notificaciones/${id}`);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // ── Manejador de errores ──────────────────────────────────────────────────

  _handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.error || data?.message || data?.mensaje || `Error ${status}`;
      return new Error(message);
    } else if (error.request) {
      return new Error("No se pudo conectar con el servidor.");
    } else {
      return new Error("Error al realizar la petición: " + error.message);
    }
  }
}

export default new NotificacionService();