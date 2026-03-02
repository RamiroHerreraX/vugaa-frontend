// src/services/regionesService.js
import API from './api';

class RegionesService {
  // ============ OPERACIONES CRUD BÁSICAS ============

  async findAll() {
    try {
      const response = await API.get('/regiones');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener regiones' };
    }
  }

  async findById(id) {
    try {
      const response = await API.get(`/regiones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Región no encontrada' };
    }
  }

  async create(regionesDTO) {
    try {
      const response = await API.post('/regiones', regionesDTO);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear la región' };
    }
  }

  async update(id, regionesDTO) {
    try {
      const response = await API.put(`/regiones/${id}`, regionesDTO);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar la región' };
    }
  }

  async deleteById(id) {
    try {
      const response = await API.delete(`/regiones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al eliminar la región' };
    }
  }

  async deleteAll() {
    try {
      const response = await API.delete('/regiones');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al eliminar todas las regiones' };
    }
  }

  // ============ ENDPOINTS POR INSTANCIA ============

  async findByInstanciaId(idInstancia) {
    try {
      const response = await API.get(`/regiones/instancia/${idInstancia}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener regiones por instancia' };
    }
  }

  async findByInstanciaIdAndActivas(idInstancia) {
    try {
      const response = await API.get(`/regiones/instancia/${idInstancia}/activas`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener regiones activas por instancia' };
    }
  }

  async countByInstanciaId(idInstancia) {
    try {
      const response = await API.get(`/regiones/instancia/${idInstancia}/count`);
      return response.data.total;
    } catch (error) {
      throw error.response?.data || { error: 'Error al contar regiones por instancia' };
    }
  }

  async existsByInstanciaIdAndNombre(idInstancia, nombre) {
    try {
      const response = await API.get(`/regiones/instancia/${idInstancia}/exists`, {
        params: { nombre }
      });
      return response.data.exists;
    } catch (error) {
      throw error.response?.data || { error: 'Error al verificar existencia de región' };
    }
  }

  async deleteByInstanciaId(idInstancia) {
    try {
      const response = await API.delete(`/regiones/instancia/${idInstancia}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al eliminar regiones por instancia' };
    }
  }

  // ============ ENDPOINTS POR NOMBRE DE INSTANCIA ============

  async findByNombreInstancia(nombreInstancia) {
    try {
      const response = await API.get(`/regiones/instancia/nombre/${encodeURIComponent(nombreInstancia)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener regiones por nombre de instancia' };
    }
  }

  async findByNombreInstanciaAndActivas(nombreInstancia) {
    try {
      const response = await API.get(`/regiones/instancia/nombre/${encodeURIComponent(nombreInstancia)}/activas`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener regiones activas por nombre de instancia' };
    }
  }

  // ============ ENDPOINTS POR PROPIEDADES DE REGIONES ============

  async findByActivas() {
    try {
      const response = await API.get('/regiones/activas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener regiones activas' };
    }
  }

  async findByNombreContaining(nombre) {
    try {
      const response = await API.get('/regiones/buscar', {
        params: { nombre }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al buscar regiones por nombre' };
    }
  }

  async findByNombreIgnoreCase(nombre) {
    try {
      const response = await API.get(`/regiones/nombre/${encodeURIComponent(nombre)}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error.response?.data || { error: 'Error al buscar región por nombre' };
    }
  }

  async findByPais(pais) {
    try {
      const response = await API.get(`/regiones/pais/${encodeURIComponent(pais)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener regiones por país' };
    }
  }

  async findByEstado(estado) {
    try {
      const response = await API.get(`/regiones/estado/${encodeURIComponent(estado)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener regiones por estado' };
    }
  }

  async findByPaisAndActivas(pais) {
    try {
      const response = await API.get(`/regiones/pais/${encodeURIComponent(pais)}/activas`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener regiones activas por país' };
    }
  }

  async findByEstadoAndActivas(estado) {
    try {
      const response = await API.get(`/regiones/estado/${encodeURIComponent(estado)}/activas`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener regiones activas por estado' };
    }
  }

  // ============ ENDPOINTS ADICIONALES ============

  async activarRegion(id) {
    try {
      const response = await API.patch(`/regiones/${id}/activar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al activar la región' };
    }
  }

  async desactivarRegion(id) {
    try {
      const response = await API.patch(`/regiones/${id}/desactivar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al desactivar la región' };
    }
  }

  async existsById(id) {
    try {
      const response = await API.get(`/regiones/${id}/exists`);
      return response.data.exists;
    } catch (error) {
      throw error.response?.data || { error: 'Error al verificar existencia de región' };
    }
  }
}

export default new RegionesService();