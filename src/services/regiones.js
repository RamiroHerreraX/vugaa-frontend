// src/services/regionesService.js
import API from './api';

class RegionesService {
  // ============ OPERACIONES CRUD BÁSICAS ============

  /**
   * Obtiene todas las regiones
   * @returns {Promise<Array>} Lista de regiones
   */
  async findAll() {
    try {
      const response = await API.get('/regiones');
      // Mapear la respuesta para asegurar consistencia
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(region => this.normalizarRegion(region));
      }
      return data;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error.response?.data || { error: 'Error al obtener regiones' };
    }
  }

  /**
   * Obtiene una región por su ID
   * @param {number} id - ID de la región
   * @returns {Promise<Object>} Región encontrada
   */
  async findById(id) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        throw new Error('ID inválido');
      }
      
      const response = await API.get(`/regiones/${numericId}`);
      return this.normalizarRegion(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error en findById:', error);
      throw error.response?.data || { error: 'Error al buscar la región' };
    }
  }

  /**
   * Obtiene todas las regiones activas de una instancia específica
   * @param {number} idInstancia - ID de la instancia
   * @returns {Promise<Array>} Lista de regiones activas de la instancia
   */
  async findActivasByInstanciaId(idInstancia) {
    try {
      const numericId = Number(idInstancia);
      if (isNaN(numericId)) {
        throw new Error('ID de instancia inválido');
      }

      console.log(`Obteniendo regiones activas para instancia ID: ${numericId}`);
      const response = await API.get(`/regiones/instancia/${numericId}/activas`);
      
      // Mapear la respuesta para asegurar consistencia
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(region => this.normalizarRegion(region));
      }
      return data;
    } catch (error) {
      console.error('Error en findActivasByInstanciaId:', error);
      throw error.response?.data || { error: 'Error al obtener regiones activas de la instancia' };
    }
  }

  /**
   * Normaliza una región para usar siempre idRegion
   * @param {Object} region - Región del backend
   * @returns {Object} Región normalizada
   */
  normalizarRegion(region) {
    if (!region) return null;
    
    return {
      idRegion: region.idRegion,           // Mantener el nombre original
      id: region.idRegion,                  // Alias para compatibilidad
      idInstancia: region.idInstancia,
      nombreInstancia: region.nombreInstancia,
      nombre: region.nombre,
      estado: region.estado,
      pais: region.pais,
      activa: region.activa
    };
  }

  /**
   * Prepara una región para enviar al backend
   * @param {Object} region - Región del frontend
   * @returns {Object} Región para el backend
   */
  prepararParaBackend(region) {
    return {
      idRegion: region.idRegion || region.id,  // Usar idRegion si existe, o id como fallback
      idInstancia: Number(region.idInstancia) || 1,
      nombre: region.nombre,
      estado: region.estado || null,
      pais: region.pais || 'México',
      activa: region.activa !== undefined ? region.activa : true
    };
  }

  /**
   * Crea una nueva región
   * @param {Object} regionData - Datos de la región a crear
   * @returns {Promise<Object>} Región creada
   */
  async create(regionData) {
    try {
      const payload = this.prepararParaBackend(regionData);
      // No enviar idRegion para creación
      delete payload.idRegion;
      
      console.log('Creando región con payload:', payload);
      const response = await API.post('/regiones', payload);
      return this.normalizarRegion(response.data);
    } catch (error) {
      console.error('Error en create:', error);
      throw error.response?.data || { error: 'Error al crear la región' };
    }
  }

  /**
   * Actualiza una región existente
   * @param {number} id - ID de la región a actualizar
   * @param {Object} regionData - Datos actualizados de la región
   * @returns {Promise<Object>} Región actualizada
   */
  async update(id, regionData) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        throw new Error('ID inválido');
      }

      const payload = this.prepararParaBackend({
        ...regionData,
        idRegion: numericId
      });

      console.log(`Actualizando región ${numericId} con payload:`, payload);
      const response = await API.put(`/regiones/${numericId}`, payload);
      return this.normalizarRegion(response.data);
    } catch (error) {
      console.error('Error en update:', error);
      throw error.response?.data || { error: 'Error al actualizar la región' };
    }
  }

  /**
   * Cambia el estado activo/inactivo de una región
   * @param {number} id - ID de la región
   * @param {boolean} activo - true para activar, false para desactivar
   * @returns {Promise<Object>} Objeto con mensaje y región actualizada
   */
  async cambiarEstadoActivo(id, activo) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        throw new Error('ID inválido');
      }

      console.log(`Cambiando estado de región ${numericId} a ${activo}`);
      const response = await API.patch(`/regiones/${numericId}/estado`, null, {
        params: { activo: Boolean(activo) }
      });
      
      // Normalizar la respuesta
      if (response.data.region) {
        response.data.region = this.normalizarRegion(response.data.region);
      } else {
        response.data = this.normalizarRegion(response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en cambiarEstadoActivo:', error);
      throw error.response?.data || { error: 'Error al cambiar el estado de la región' };
    }
  }

  /**
   * Busca una región por nombre exacto (ignore case)
   * @param {string} nombre - Nombre de la región
   * @returns {Promise<Object|null>} Región encontrada o null
   */
  async findByNombreIgnoreCase(nombre) {
    try {
      if (!nombre || nombre.length < 3) return null;
      
      const response = await API.get(`/regiones/nombre/${encodeURIComponent(nombre)}`);
      return this.normalizarRegion(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error en findByNombreIgnoreCase:', error);
      return null;
    }
  }

  /**
   * Verifica si existe una región por su ID
   * @param {number} id - ID de la región
   * @returns {Promise<boolean>} true si existe, false si no
   */
  async existsById(id) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        return false;
      }
      const response = await API.get(`/regiones/${numericId}/exists`);
      return response.data.exists;
    } catch (error) {
      console.error('Error en existsById:', error);
      return false;
    }
  }

  // ============ MÉTODOS DE CONVENIENCIA ============

  async activarRegion(id) {
    return this.cambiarEstadoActivo(id, true);
  }

  async desactivarRegion(id) {
    return this.cambiarEstadoActivo(id, false);
  }
}

export default new RegionesService();