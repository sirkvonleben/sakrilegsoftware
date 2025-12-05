import apiClient from './axiosConfig';

// Usamos una ruta relativa. 
// Vite (el proxy) la redirigirá a http://localhost:8090/api/v1/inventario
const API_URL = '/inventario';

/**
 * RF-12: Consulta el stock actual por producto y sucursal.
 * (Este método coincide con el DTO 'ConsultaStockRequest' del backend)
 */
const consultarStock = async (productoId, sucursalId) => {
    try {
        const response = await apiClient.post(`${API_URL}/consulta`, {
            productoId: productoId,
            sucursalId: sucursalId
        });
        return response.data;
    } catch (error) {
        console.error("Error al consultar stock:", error);
        throw error;
    }
};

/**
 * (Opcional: Si decides implementar un GET para todo el inventario)
 */
const getAllInventario = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener todo el inventario:", error);
        throw error;
    }
};

export default { 
    consultarStock,
    getAllInventario 
};