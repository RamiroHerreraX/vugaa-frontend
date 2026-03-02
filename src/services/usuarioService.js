// src/services/usuarioService.js
import API from './api';

class UsuarioService {
  // ============= MÉTODOS EXISTENTES (para CRUD normal) =============
  
  async findAll() {
    try {
      const response = await API.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error.response?.data || { error: 'Error al obtener usuarios' };
    }
  }

  async findById(id) {
    try {
      const response = await API.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en findById:', error);
      throw error.response?.data || { error: 'Usuario no encontrado' };
    }
  }

  async create(usuarioDTO) {
    try {
      const response = await API.post('/usuarios', usuarioDTO);
      return response.data;
    } catch (error) {
      console.error('Error en create:', error);
      throw error.response?.data || { error: 'Error al crear el usuario' };
    }
  }

  async update(id, usuarioDTO) {
    try {
      const response = await API.put(`/usuarios/${id}`, usuarioDTO);
      return response.data;
    } catch (error) {
      console.error('Error en update:', error);
      throw error.response?.data || { error: 'Error al actualizar el usuario' };
    }
  }

  async cambiarEstadoActivo(id, activo) {
    try {
      const response = await API.patch(`/usuarios/${id}/estado`, null, {
        params: { activo }
      });
      return response.data;
    } catch (error) {
      console.error('Error en cambiarEstadoActivo:', error);
      throw error.response?.data || { error: 'Error al cambiar el estado del usuario' };
    }
  }

  // ============= MÉTODOS PARA LA TABLA PRINCIPAL =============

  async findAllForTable() {
    try {
      const response = await API.get('/usuarios/tabla');
      return response.data;
    } catch (error) {
      console.error('Error en findAllForTable:', error);
      throw error.response?.data || { error: 'Error al obtener usuarios para la tabla' };
    }
  }

  async findByIdForTable(id) {
    try {
      const response = await API.get(`/usuarios/tabla/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en findByIdForTable:', error);
      throw error.response?.data || { error: 'Usuario no encontrado en tabla' };
    }
  }

  // ============= MÉTODOS DE UTILIDAD =============

  formatUltimoAcceso(ultimoAcceso) {
    if (!ultimoAcceso) return 'Nunca';
    
    try {
      const fecha = new Date(ultimoAcceso);
      const ahora = new Date();
      const diffHoras = Math.floor((ahora - fecha) / (1000 * 60 * 60));
      
      if (diffHoras < 24) {
        if (diffHoras < 1) {
          const diffMinutos = Math.floor((ahora - fecha) / (1000 * 60));
          return diffMinutos < 1 ? 'Hace unos segundos' : `Hace ${diffMinutos} minutos`;
        }
        return `Hace ${diffHoras} horas`;
      } else if (diffHoras < 48) {
        return 'Ayer';
      } else {
        return fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha inválida';
    }
  }

  getEstadoClass(estado) {
    switch(estado?.toLowerCase()) {
      case 'activo':
        return 'badge-success';
      case 'inactivo':
        return 'badge-warning';
      case 'bloqueado':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getEstadoTexto(estado) {
    switch(estado?.toLowerCase()) {
      case 'activo':
        return 'Activo';
      case 'inactivo':
        return 'Inactivo';
      case 'bloqueado':
        return 'Bloqueado';
      default:
        return 'Desconocido';
    }
  }
}

export default new UsuarioService();