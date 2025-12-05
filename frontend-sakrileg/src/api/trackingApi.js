import apiClient from './axiosConfig';

const API_URL = '/tracking';

const getAllTracking = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener datos de tracking:", error);
        throw error;
    }
};

export default { 
    getAllTracking 
};