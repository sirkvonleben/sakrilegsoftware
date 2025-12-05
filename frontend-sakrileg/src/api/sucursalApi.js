import apiClient from './axiosConfig';

// Usamos una ruta relativa para el proxy de Vite
const API_URL = '/sucursales';

/**
 * Obtiene la lista completa de todas las sucursales
 */
const getAllSucursales = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener sucursales:", error);
        throw error;
    }
};

export default {
    getAllSucursales
};