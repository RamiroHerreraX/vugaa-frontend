// src/services/declaracionesService.js  —  VERSIÓN FINAL
import API from './api';

class DeclaracionesService {

  async findAll() {
    try {
      const response = await API.get('/declaraciones');
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(d => this.normalizarDeclaracion(d));
      }
      return data;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error.response?.data || { error: 'Error al obtener declaraciones' };
    }
  }

  async findById(id) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) throw new Error('ID inválido');
      const response = await API.get(`/declaraciones/${numericId}`);
      return this.normalizarDeclaracion(response.data);
    } catch (error) {
      if (error.response?.status === 404) return null;
      console.error('Error en findById:', error);
      throw error.response?.data || { error: 'Error al buscar la declaración' };
    }
  }

  async findByTipo(tipo) {
    try {
      if (!tipo) throw new Error('Tipo inválido');
      const response = await API.get(`/declaraciones/tipo/${encodeURIComponent(tipo)}`);
      const data = response.data;
      if (Array.isArray(data)) return data.map(d => this.normalizarDeclaracion(d));
      return data;
    } catch (error) {
      console.error('Error en findByTipo:', error);
      throw error.response?.data || { error: 'Error al obtener declaraciones por tipo' };
    }
  }

  async findByInstancia(idInstancia) {
    try {
      const numericId = Number(idInstancia);
      if (isNaN(numericId)) throw new Error('ID de instancia inválido');
      const response = await API.get(`/declaraciones/instancia/${numericId}`);
      const data = response.data;
      if (Array.isArray(data)) return data.map(d => this.normalizarDeclaracion(d));
      return data;
    } catch (error) {
      console.error('Error en findByInstancia:', error);
      throw error.response?.data || { error: 'Error al obtener declaraciones de la instancia' };
    }
  }

  async findByNombre(nombre) {
    try {
      if (!nombre || nombre.length < 2) return [];
      const response = await API.get('/declaraciones/buscar', { params: { nombre } });
      const data = response.data;
      if (Array.isArray(data)) return data.map(d => this.normalizarDeclaracion(d));
      return data;
    } catch (error) {
      console.error('Error en findByNombre:', error);
      throw error.response?.data || { error: 'Error al buscar declaraciones por nombre' };
    }
  }

  /**
   * Normaliza la respuesta del backend.
   *
   * FIX BOTONES: La entidad Declaracion tiene dos formas de exponer idInstancia:
   *   - declaracion.idInstancia  (campo @Column readonly — puede ser null antes del flush)
   *   - declaracion.instancia.id (relación @ManyToOne — el PK real de Instancia)
   *
   * El mapToDTO del backend CORREGIDO siempre usa instancia.getId() como fuente
   * de verdad, por lo que el DTO siempre tendrá idInstancia como Number.
   *
   * Esta función es defensiva: resuelve ambas variantes por si acaso.
   */
  normalizarDeclaracion(declaracion) {
    if (!declaracion) return null;

    // Resolver idInstancia — cubrir todas las formas posibles que puede venir
    const idInstanciaRaw =
      declaracion.idInstancia           ??  // campo plano (correcto tras el fix del backend)
      declaracion.instancia?.id         ??  // objeto anidado - PK real de Instancia
      declaracion.instancia?.idInstancia ??  // objeto anidado - variante legacy
      null;

    const idInstancia = idInstanciaRaw !== null && idInstanciaRaw !== undefined
      ? Number(idInstanciaRaw)
      : null;

    console.debug(`[normalizarDeclaracion] id=${declaracion.idDeclaracion} idInstancia=${idInstancia} activa=${declaracion.activa}`);

    return {
      idDeclaracion:      declaracion.idDeclaracion,
      id:                 declaracion.idDeclaracion,
      idInstancia,                              // siempre Number o null
      nombre:             declaracion.nombre,
      articuloReferencia: declaracion.articuloReferencia || null,
      descripcion:        declaracion.descripcion        || null,
      tipo:               declaracion.tipo,
      vigenciaDias:       declaracion.vigenciaDias ?? 365,
      activa:             declaracion.activa !== undefined && declaracion.activa !== null
                            ? Boolean(declaracion.activa)
                            : true,
      configuracionJson:  declaracion.configuracionJson  || null,
      fechaCreacion:      declaracion.fechaCreacion      || null,
      fechaActualizacion: declaracion.fechaActualizacion || null,
    };
  }

  prepararParaBackend(declaracion) {
    return {
      idDeclaracion:      declaracion.idDeclaracion || declaracion.id || null,
      idInstancia:        Number(declaracion.idInstancia),
      nombre:             declaracion.nombre,
      articuloReferencia: declaracion.articuloReferencia || null,
      descripcion:        declaracion.descripcion        || null,
      tipo:               declaracion.tipo               || null,
      vigenciaDias:       Number(declaracion.vigenciaDias) || 365,
      activa:             declaracion.activa !== undefined && declaracion.activa !== null
                            ? Boolean(declaracion.activa)
                            : true,
      configuracionJson:  declaracion.configuracionJson  || null,
    };
  }

  async create(declaracionData) {
    try {
      const payload = this.prepararParaBackend(declaracionData);
      delete payload.idDeclaracion;
      console.log('Creando declaración con payload:', payload);
      const response = await API.post('/declaraciones', payload);
      return this.normalizarDeclaracion(response.data);
    } catch (error) {
      console.error('Error en create:', error);
      throw error.response?.data || { error: 'Error al crear la declaración' };
    }
  }

  async update(id, declaracionData) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) throw new Error('ID inválido');
      const payload = this.prepararParaBackend({ ...declaracionData, idDeclaracion: numericId });
      console.log(`Actualizando declaración ${numericId}:`, payload);
      const response = await API.put(`/declaraciones/${numericId}`, payload);
      return this.normalizarDeclaracion(response.data);
    } catch (error) {
      console.error('Error en update:', error);
      throw error.response?.data || { error: 'Error al actualizar la declaración' };
    }
  }

  async delete(id) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) throw new Error('ID inválido');
      await API.delete(`/declaraciones/${numericId}`);
      return true;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error.response?.data || { error: 'Error al eliminar la declaración' };
    }
  }

  /**
   * PATCH /declaraciones/{id}/estado
   *
   * Con el fix del backend (setActiva ahora usa findById + setActiva + save),
   * este endpoint ya funciona correctamente. Solo retorna null si el backend
   * responde sin body (lo cual no debería pasar con el fix).
   */
  async setActiva(id, activa) {
    const numericId = Number(id);
    if (isNaN(numericId)) throw new Error('ID inválido');

    try {
      const response = await API.patch(`/declaraciones/${numericId}/estado`, null, {
        params: { activa: Boolean(activa) },
      });
      return response.data ? this.normalizarDeclaracion(response.data) : null;
    } catch (error) {
      console.error('Error en setActiva:', error);
      throw error.response?.data || { error: 'Error al cambiar el estado de la declaración' };
    }
  }

  async activarDeclaracion(id)    { return this.setActiva(id, true);  }
  async desactivarDeclaracion(id) { return this.setActiva(id, false); }

  async findActivasByTipo(tipo) {
    const lista = await this.findByTipo(tipo);
    return lista.filter(d => d.activa === true);
  }

  async findActivasByInstancia(idInstancia) {
    const lista = await this.findByInstancia(idInstancia);
    return lista.filter(d => d.activa === true);
  }


  // ── DeclaracionUsuario ──────────────────────────────────────────────────────

async guardarRespuesta({ idDeclaracion, idExpediente, checks, declaracionBuenaFe = true }) {
  try {
    const checksMarcados = checks.filter(c => c.respuesta === 'si').length;
    const totalChecks    = checks.length;
    const porcentaje     = totalChecks > 0 ? Math.round((checksMarcados / totalChecks) * 100) : 0;
    const estado         = porcentaje >= 80 ? 'cumple_totalmente'
                         : porcentaje >= 60 ? 'cumple_parcialmente'
                         : 'no_cumple';

    const respuestaJson = JSON.stringify({
      declaracionBuenaFe,
      fechaDeclaracion: new Date().toISOString(),
      checks: checks.map(c => ({
        id:        c.id,
        texto:     c.texto,
        marcado:   c.respuesta === 'si',
        respuesta: c.respuesta,           // 'si' | 'no'
        motivo:    c.motivo || null,      // texto del motivo si no cumple
        fundamento: c.fundamento || null,
      })),
      totalChecks,
      checksMarcados,
      porcentajeCumplimiento: porcentaje,
      estado,
    });

    const payload = {
      idDeclaracion:  Number(idDeclaracion),
      idExpediente:   Number(idExpediente),
      respuestaJson,
      estado:         'PRESENTADA',
      vigenciaInicio: new Date().toISOString().split('T')[0],
    };

    const response = await API.post('/declaraciones-usuario', payload);
    return response.data;
  } catch (error) {
    console.error('Error en guardarRespuesta:', error);
    throw error.response?.data || { error: 'Error al guardar la respuesta de declaración' };
  }
}

async findRespuestasPorExpediente(idExpediente) {
  try {
    const response = await API.get(`/declaraciones-usuario/expediente/${Number(idExpediente)}`);
    return response.data;
  } catch (error) {
    console.error('Error en findRespuestasPorExpediente:', error);
    throw error.response?.data || { error: 'Error al obtener respuestas' };
  }
}
}

export default new DeclaracionesService();