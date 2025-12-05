import apiClient from './axiosConfig'; 

const API_URL = '/ingresos';

const registrarIngreso = async (ingresoData) => {
    try {
        const response = await apiClient.post(API_URL, ingresoData);
        return response.data;
    } catch (error) {
        console.error("Error al registrar ingreso:", error);
        throw error;
    }
};

/**
 * --- ¡NUEVA FUNCIÓN AÑADIDA! ---
 * Crea un ingreso de prueba (Usado por Admin).
 */
const createTestIngreso = async () => {
    try {
        // Llama al nuevo endpoint del backend
        const response = await apiClient.post(`${API_URL}/test-create`);
        return response.data;
    } catch (error) {
        console.error("Error al registrar ingreso de prueba:", error);
        throw error;
    }
};

const getAllIngresos = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener ingresos:", error);
        throw error;
    }
};

const anularIngreso = async (id) => {
    try {
        const response = await apiClient.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al anular ingreso:", error);
        throw error;
    }
};

export default { 
    registrarIngreso, 
    createTestIngreso, // <-- Nueva exportación
    getAllIngresos,
    anularIngreso
};