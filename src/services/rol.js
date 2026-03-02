// src/services/rolService.js
import API from './api';

class RolService {
  async findAll() {
    try {
      const response = await API.get('/roles');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener roles' };
    }
  }

  async findById(id) {
    try {
      const response = await API.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Rol no encontrado' };
    }
  }

  async create(rolDTO) {
    try {
      const response = await API.post('/roles', rolDTO);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear el rol' };
    }
  }

  async update(id, rolDTO) {
    try {
      const response = await API.put(`/roles/${id}`, rolDTO);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar el rol' };
    }
  }

  async delete(id) {
    try {
      const response = await API.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al desactivar el rol' };
    }
  }

  async changeEstado(id, activo) {
    try {
      const response = await API.patch(`/roles/${id}/estado`, { activo });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al cambiar el estado del rol' };
    }
  }

  async existsByNombre(nombre) {
    try {
      const response = await API.get(`/roles/existe/nombre/${encodeURIComponent(nombre)}`);
      return response.data.exists;
    } catch (error) {
      throw error.response?.data || { error: 'Error al verificar nombre' };
    }
  }

  async existsByNombreAndIdNot(nombre, id) {
    try {
      const response = await API.get(`/roles/existe/nombre/${encodeURIComponent(nombre)}/excepto/${id}`);
      return response.data.exists;
    } catch (error) {
      throw error.response?.data || { error: 'Error al verificar nombre' };
    }
  }
}

export default new RolService();