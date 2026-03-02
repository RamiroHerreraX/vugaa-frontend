// src/services/asociacionService.js
import API from './api';

class AsociacionService {
    async findAll() {
        try {
            const response = await API.get('/asociaciones');
            return response.data;
        } catch (error) {
            console.error('Error en findAll:', error);
            throw this._handleError(error, 'Error al obtener asociaciones');
        }
    }

    async findById(id) {
        try {
            const response = await API.get(`/asociaciones/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error en findById:', error);
            throw this._handleError(error, 'Asociación no encontrada');
        }
    }

    async create(asociacionDTO) {
        try {
            const response = await API.post('/asociaciones', asociacionDTO);
            return response.data;
        } catch (error) {
            console.error('Error en create:', error);
            throw this._handleError(error, 'Error al crear la asociación');
        }
    }

    async update(id, asociacionDTO) {
        try {
            const response = await API.put(`/asociaciones/${id}`, asociacionDTO);
            return response.data;
        } catch (error) {
            console.error('Error en update:', error);
            throw this._handleError(error, 'Error al actualizar la asociación');
        }
    }

    async changeEstado(id, activa) {
        try {
            const response = await API.patch(`/asociaciones/${id}/estado`, { activa });
            return response.data;
        } catch (error) {
            console.error('Error en changeEstado:', error);
            throw this._handleError(error, 'Error al cambiar el estado de la asociación');
        }
    }

    async existsByNombre(nombre) {
        try {
            const response = await API.get(`/asociaciones/existe/nombre/${encodeURIComponent(nombre)}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error en existsByNombre:', error);
            throw this._handleError(error, 'Error al verificar nombre');
        }
    }

    async existsByNombreAndIdNot(nombre, id) {
        try {
            const response = await API.get(`/asociaciones/existe/nombre/${encodeURIComponent(nombre)}/excepto/${id}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error en existsByNombreAndIdNot:', error);
            throw this._handleError(error, 'Error al verificar nombre');
        }
    }

    // Manejador de errores unificado
    _handleError(error, defaultMessage) {
        // Si ya es un error que hemos procesado
        if (error instanceof Error) {
            return error;
        }

        if (error.response) {
            // El servidor respondió con un código de error
            const { data, status } = error.response;
            
            // Si el backend envía un mensaje específico
            if (data) {
                if (data.mensaje) {
                    return new Error(data.mensaje);
                }
                if (data.message) {
                    return new Error(data.message);
                }
                if (data.error) {
                    return new Error(data.error);
                }
            }
            
            // Errores específicos por código HTTP
            switch (status) {
                case 400:
                    return new Error('Solicitud incorrecta. Verifique los datos ingresados.');
                case 401:
                    return new Error('No autorizado. Por favor, inicie sesión nuevamente.');
                case 403:
                    return new Error('No tiene permisos para realizar esta acción.');
                case 404:
                    return new Error('El recurso solicitado no fue encontrado.');
                case 409:
                    return new Error('Conflicto: Ya existe un registro con estos datos.');
                case 422:
                    return new Error('Los datos enviados no son válidos.');
                case 500:
                    return new Error('Error interno del servidor. Por favor, contacte al administrador.');
                default:
                    return new Error(`Error ${status}: ${data?.message || defaultMessage}`);
            }
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            return new Error('No se pudo conectar con el servidor. Verifique su conexión a internet.');
        } else {
            // Algo pasó al configurar la petición
            return new Error(error.message || defaultMessage);
        }
    }
}

export default new AsociacionService();