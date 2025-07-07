import axios from 'axios';
import { config } from '../config/config';

// Configuración base de Axios
const API_BASE_URL = config.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Servicios para Materiales
export const materialesService = {
  // Obtener todos los materiales
  getAll: async () => {
    try {
      const response = await api.get('/materials');
      return response.data;
    } catch (error) {
      console.error('Error al obtener materiales:', error);
      throw error;
    }
  },

  // Obtener un material por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/materials/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener material:', error);
      throw error;
    }
  },

  // Crear un nuevo material
  create: async (material) => {
    try {
      const response = await api.post('/materials', material);
      return response.data;
    } catch (error) {
      console.error('Error al crear material:', error);
      throw error;
    }
  },

  // Actualizar un material
  update: async (id, material) => {
    try {
      const response = await api.put(`/materials/${id}`, material);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar material:', error);
      throw error;
    }
  },

  // Eliminar un material
  delete: async (id) => {
    try {
      const response = await api.delete(`/materials/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar material:', error);
      throw error;
    }
  },
};

// Servicios para Cotizaciones
export const cotizacionesService = {
  // Obtener todas las cotizaciones
  getAll: async () => {
    try {
      const response = await api.get('/quotes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
      throw error;
    }
  },

  // Obtener una cotización por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/quotes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cotización:', error);
      throw error;
    }
  },

  // Crear una nueva cotización
  create: async (cotizacion) => {
    try {
      const response = await api.post('/quotes', cotizacion);
      return response.data;
    } catch (error) {
      console.error('Error al crear cotización:', error);
      throw error;
    }
  },

  // Actualizar una cotización
  update: async (id, cotizacion) => {
    try {
      const response = await api.put(`/quotes/${id}`, cotizacion);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar cotización:', error);
      throw error;
    }
  },

  // Eliminar una cotización
  delete: async (id) => {
    try {
      const response = await api.delete(`/quotes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar cotización:', error);
      throw error;
    }
  },

  // Obtener estadísticas de cotizaciones
  getStats: async () => {
    try {
      const response = await api.get('/quotes/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },
};

// Servicios para Dashboard/Estadísticas
export const dashboardService = {
  // Obtener estadísticas generales
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  },

  // Obtener actividad reciente
  getRecentActivity: async () => {
    try {
      const response = await api.get('/dashboard/recent-activity');
      return response.data;
    } catch (error) {
      console.error('Error al obtener actividad reciente:', error);
      throw error;
    }
  },
};

// Función para manejar errores de red
export const handleApiError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return `Error de validación: ${data.message || 'Datos inválidos'}`;
      case 401:
        return 'No autorizado. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'Acceso denegado. No tienes permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 500:
        return 'Error interno del servidor. Por favor, intenta más tarde.';
      default:
        return `Error ${status}: ${data.message || 'Error desconocido'}`;
    }
  } else if (error.request) {
    // La petición fue hecha pero no se recibió respuesta
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
  } else {
    // Algo sucedió en la configuración de la petición
    return 'Error al procesar la petición.';
  }
};

export default api; 