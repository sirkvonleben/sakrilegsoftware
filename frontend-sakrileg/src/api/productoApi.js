// frontend/src/api/productoApi.js
import apiClient from './axiosConfig'; 

const API_URL = '/productos';

// (Función de manejo de errores sin cambios)
const handleError = (error, fallbackMessage) => {
    console.error(fallbackMessage, error);
    const message = error.response?.data?.message || error.message || fallbackMessage;
    throw new Error(message);
};

/**
 * RF-11: Obtiene la lista completa de productos.
 */
const getAllProductos = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        handleError(error, "Error al obtener productos.");
    }
};

/**
 * RF-11: Obtiene un producto por su ID.
 */
const getProductoById = async (id) => {
     try {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        handleError(error, `Error al obtener producto ${id}.`);
    }
};

/**
 * RF-11: Crea un nuevo producto (Usado por Jefe/Operador).
 */
const createProducto = async (productoData) => {
    try {
        const response = await apiClient.post(API_URL, productoData);
        return response.data;
    } catch (error) {
        handleError(error, "Error al crear producto.");
    }
};

/**
 * --- ¡NUEVA FUNCIÓN AÑADIDA! ---
 * Crea un producto de prueba (Usado por Admin).
 */
const createTestProducto = async () => {
    try {
        // Llama al nuevo endpoint del backend
        const response = await apiClient.post(`${API_URL}/test-create`);
        return response.data;
    } catch (error) {
        handleError(error, "Error al crear producto de prueba.");
    }
};

/**
 * RF-11: Actualiza un producto existente.
 */
const updateProducto = async (id, productoData) => {
     try {
        const response = await apiClient.put(`${API_URL}/${id}`, productoData);
        return response.data;
    } catch (error) {
        handleError(error, `Error al actualizar producto ${id}.`);
    }
};

/**
 * RF-11: Desactiva un producto (Usado por Jefe).
 */
const deactivateProducto = async (id) => {
    try {
        // (Esta función faltaba en el archivo original, la añado para 'CatalogoStockList.jsx')
        const response = await apiClient.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        handleError(error, `Error al desactivar producto ${id}.`);
    }
};


export default { 
    getAllProductos,
    getProductoById,
    createProducto,
    createTestProducto, // <-- Nueva exportación
    updateProducto,
    deactivateProducto  // <-- Nueva exportación
};