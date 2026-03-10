// src/services/auditoriaService.js
import API from "./api";

class AuditoriaService {

  async findAll() {
    try {
      const response = await API.get("/auditoria");
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async findById(id) {
    try {
      const response = await API.get(`/auditoria/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async findByUsuario(idUsuario) {
    try {
      const response = await API.get(`/auditoria/usuario/${idUsuario}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async findByInstancia(idInstancia) {
    try {
      const response = await API.get(`/auditoria/instancia/${idInstancia}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async findByEntidad(entidadTipo, idEntidad) {
    try {
      const response = await API.get(`/auditoria/entidad/${entidadTipo}/${idEntidad}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async findByRangoFechas(desde, hasta) {
    try {
      const response = await API.get("/auditoria/fechas", {
        params: { desde: desde.toISOString(), hasta: hasta.toISOString() },
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async filtrar({ idUsuario, idInstancia, entidadTipo, accion, desde, hasta } = {}) {
    try {
      const params = {};
      if (idUsuario   !== undefined && idUsuario   !== null) params.idUsuario   = idUsuario;
      if (idInstancia !== undefined && idInstancia !== null) params.idInstancia = idInstancia;
      if (entidadTipo)                                       params.entidadTipo = entidadTipo;
      if (accion)                                            params.accion      = accion;
      if (desde)                                             params.desde       = desde instanceof Date ? desde.toISOString() : desde;
      if (hasta)                                             params.hasta       = hasta instanceof Date ? hasta.toISOString() : hasta;

      const response = await API.get("/auditoria/filtrar", { params });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async countByInstancia(idInstancia) {
    try {
      const response = await API.get(`/auditoria/count/instancia/${idInstancia}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async countByUsuario(idUsuario) {
    try {
      const response = await API.get(`/auditoria/count/usuario/${idUsuario}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Mis logs combinados: propios + permisos de asociados + donde aparezco mencionado
  async misLogs(idUsuario, { desde, hasta } = {}) {
    try {
      const params = { idUsuario };
      if (desde) params.desde = desde instanceof Date ? desde.toISOString() : desde;
      if (hasta) params.hasta = hasta instanceof Date ? hasta.toISOString() : hasta;

      const response = await API.get("/auditoria/mis-logs", { params });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

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

export default new AuditoriaService();