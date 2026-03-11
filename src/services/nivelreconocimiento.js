import API from './api';

class NivelReconocimientoService {

  async findAll() {
    try {
      const response = await API.get('/niveles_reconocimiento');
      const data = response.data;
      if (Array.isArray(data)) return data.map(n => this.normalizar(n));
      return data;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error.response?.data || { error: 'Error al obtener los niveles de reconocimiento' };
    }
  }

  async findById(id) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) throw new Error('ID inválido');
      const response = await API.get(`/niveles_reconocimiento/${numericId}`);
      return this.normalizar(response.data);
    } catch (error) {
      if (error.response?.status === 404) return null;
      console.error('Error en findById:', error);
      throw error.response?.data || { error: 'Error al buscar el nivel de reconocimiento' };
    }
  }

  async findByInstancia(idInstancia) {
    try {
      const numericId = Number(idInstancia);
      if (isNaN(numericId)) throw new Error('ID de instancia inválido');
      const response = await API.get(`/niveles_reconocimiento/instancia/${numericId}`);
      const data = response.data;
      if (Array.isArray(data)) return data.map(n => this.normalizar(n));
      return data;
    } catch (error) {
      console.error('Error en findByInstancia:', error);
      throw error.response?.data || { error: 'Error al obtener niveles de la instancia' };
    }
  }

  async create(nivelData) {
    try {
      const payload = this.prepararParaBackend(nivelData);
      delete payload.idNivel;
      const response = await API.post('/niveles_reconocimiento', payload);
      return this.normalizar(response.data);
    } catch (error) {
      console.error('Error en create:', error);
      throw error.response?.data || { error: 'Error al crear el nivel de reconocimiento' };
    }
  }

  async update(id, nivelData) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) throw new Error('ID inválido');
      const payload = this.prepararParaBackend({ ...nivelData, idNivel: numericId });
      const response = await API.put(`/niveles_reconocimiento/${numericId}`, payload);
      return this.normalizar(response.data);
    } catch (error) {
      console.error('Error en update:', error);
      throw error.response?.data || { error: 'Error al actualizar el nivel de reconocimiento' };
    }
  }

  async delete(id) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) throw new Error('ID inválido');
      await API.delete(`/niveles_reconocimiento/${numericId}`);
      return true;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error.response?.data || { error: 'Error al eliminar el nivel de reconocimiento' };
    }
  }

  normalizar(nivel) {
    if (!nivel) return null;

    const idInstanciaRaw =
      nivel.idInstancia       ??
      nivel.instancia?.id     ??
      null;

    const idInstancia = idInstanciaRaw !== null && idInstanciaRaw !== undefined
      ? Number(idInstanciaRaw)
      : null;

    return {
      idNivel:            nivel.idNivel,
      id:                 nivel.idNivel,
      idInstancia,
      nombre:             nivel.nombre            || null,
      nivel:              nivel.nivel             ?? null,
      descripcion:        nivel.descripcion       || null,
      reglasJson:         nivel.reglasJson        || null,
      activo:             nivel.activo !== undefined && nivel.activo !== null
                            ? Boolean(nivel.activo)
                            : true,
      fechaCreacion:      nivel.fechaCreacion     || null,
      fechaActualizacion: nivel.fechaActualizacion || null,
    };
  }

  prepararParaBackend(nivel) {
    return {
      idNivel:      nivel.idNivel || nivel.id || null,
      idInstancia:  Number(nivel.idInstancia),
      nombre:       nivel.nombre             || null,
      nivel:        Number(nivel.nivel),
      descripcion:  nivel.descripcion        || null,
      reglasJson:   nivel.reglasJson         || null,
      activo:       nivel.activo !== undefined && nivel.activo !== null
                      ? Boolean(nivel.activo)
                      : true,
    };
  }
}

export default new NivelReconocimientoService();