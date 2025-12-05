// frontend/src/api/salidaApi.js
import apiClient from './axiosConfig'; 

const API_URL = '/salidas';

/**
 * RF-06: Registra una nueva Nota de Salida.
 */
const registrarSalida = async (salidaData) => {
    try {
        const response = await apiClient.post(API_URL, salidaData);
        return response.data;
    } catch (error) {
        console.error("Error al registrar salida:", error);
        throw error;
    }
};

/**
 * --- ¡NUEVA FUNCIÓN AÑADIDA! ---
 * Crea una salida de prueba (Usado por Admin).
 */
const createTestSalida = async () => {
    try {
        // Llama al nuevo endpoint del backend
        const response = await apiClient.post(`${API_URL}/test-create`);
        return response.data;
    } catch (error) {
        console.error("Error al registrar salida de prueba:", error);
        throw error;
    }
};


/**
 * RF-10: Obtiene el historial de salidas.
 */
const getAllSalidas = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener salidas:", error);
        throw error;
    }
};

// (Necesitaremos esto más tarde para anular)
const anularSalida = async (id) => {
    try {
        const response = await apiClient.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al anular salida:", error);
        throw error;
    }
};

export default { 
    registrarSalida, 
    createTestSalida, // <-- Nueva exportación
    getAllSalidas,
    anularSalida
};