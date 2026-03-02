// src/services/usuarioService.js
import API from './api';

class UsuarioService {
  // ============= MÉTODOS EXISTENTES (para CRUD normal) =============
  
  /**
   * Obtiene todos los usuarios (formato completo)
   */
  async findAll() {
    try {
      const response = await API.get('/usuarios');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener usuarios' };
    }
  }

  /**
   * Obtiene un usuario por ID (formato completo)
   */
  async findById(id) {
    try {
      const response = await API.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Usuario no encontrado' };
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async create(usuarioDTO) {
    try {
      const response = await API.post('/usuarios', usuarioDTO);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear el usuario' };
    }
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id, usuarioDTO) {
    try {
      const response = await API.put(`/usuarios/${id}`, usuarioDTO);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar el usuario' };
    }
  }

  /**
   * Cambia el estado activo de un usuario
   */
  async cambiarEstadoActivo(id, activo) {
    try {
      const response = await API.patch(`/usuarios/${id}/estado-activo`, null, {
        params: { activo }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al cambiar el estado del usuario' };
    }
  }

  // ============= NUEVOS MÉTODOS PARA LA TABLA PRINCIPAL =============

  /**
   * Obtiene todos los usuarios con formato optimizado para tabla principal
   * Retorna: Usuario, Rol, Región, Último Acceso, Estado
   */
  async findAllForTable() {
    try {
      const response = await API.get('/usuarios/tabla');
      return response.data;
    } catch (error) {
      console.error('Error en findAllForTable:', error);
      throw error.response?.data || { error: 'Error al obtener usuarios para la tabla' };
    }
  }

  /**
   * Obtiene un usuario específico con formato optimizado para tabla
   */
  async findByIdForTable(id) {
    try {
      const response = await API.get(`/usuarios/tabla/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en findByIdForTable:', error);
      throw error.response?.data || { error: 'Usuario no encontrado en tabla' };
    }
  }

  // ============= MÉTODOS DE UTILIDAD ADICIONALES =============

  /**
   * Verifica si un email ya existe
   */
  async existsByEmail(email) {
    try {
      const response = await API.get(`/usuarios/existe/email/${encodeURIComponent(email)}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error en existsByEmail:', error);
      throw error.response?.data || { error: 'Error al verificar email' };
    }
  }

  /**
   * Verifica si un email ya existe excepto para un ID específico (útil para actualizaciones)
   */
  async existsByEmailAndIdNot(email, id) {
    try {
      const response = await API.get(`/usuarios/existe/email/${encodeURIComponent(email)}/excepto/${id}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error en existsByEmailAndIdNot:', error);
      throw error.response?.data || { error: 'Error al verificar email' };
    }
  }

  /**
   * Formatea la fecha de último acceso para mostrar en la tabla
   */
  formatUltimoAcceso(ultimoAcceso) {
    if (!ultimoAcceso) return 'Nunca';
    
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
  }

  /**
   * Obtiene la clase CSS para el estado del usuario
   */
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

  /**
   * Obtiene el texto del estado en español
   */
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