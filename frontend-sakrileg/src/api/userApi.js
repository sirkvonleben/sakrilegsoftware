// frontend/src/api/userApi.js

import apiClient from './axiosConfig'; // <-- IMPORTANTE: Usamos nuestra instancia configurada

// Ruta relativa (el proxy redirige a http://localhost:8090/api/v1/usuarios)
const API_URL = '/usuarios';

/**
 * RF-01: Obtener la lista de todos los usuarios
 */
const getAllUsers = async () => {
    try {
        // Usamos apiClient para que incluya el Token automáticamente
        const response = await apiClient.get(API_URL);
        return response.data; 
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error; 
    }
};

/**
 * Obtener un usuario por ID (Necesario para el formulario de edición)
 */
const getUserById = async (id) => {
    try {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener usuario ${id}:`, error);
        throw error;
    }
};

/**
 * RF-01 y RF-02: Crear un nuevo usuario
 */
const createUser = async (userData) => {
    try {
        const response = await apiClient.post(API_URL, userData);
        return response.data; 
    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error;
    }
};

/**
 * RF-01: Actualizar un usuario existente
 */
const updateUser = async (id, userData) => {
    try {
        const response = await apiClient.put(`${API_URL}/${id}`, userData);
        return response.data; 
    } catch (error) {
        console.error(`Error al actualizar usuario ${id}:`, error);
        throw error;
    }
};

/**
 * RF-01 (Anular/Desactivar): Desactivar un usuario (DELETE)
 */
const deactivateUser = async (id) => {
    try {
        await apiClient.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error al desactivar usuario ${id}:`, error);
        throw error;
    }
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deactivateUser,
};