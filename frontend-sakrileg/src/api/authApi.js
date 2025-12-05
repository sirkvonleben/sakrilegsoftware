// frontend/src/api/authApi.js

import apiClient from './axiosConfig';
const API_URL = '/auth';

/**
 * Llama al endpoint /login del backend y guarda el token.
 */
const login = async (login, password) => {
    try {
        // Enviamos 'login' y 'password' como espera tu AuthController
        const response = await apiClient.post(`${API_URL}/login`, {
            login: login,
            password: password
        });

        // Si el login es exitoso, guardamos el token en LocalStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data; 
    } catch (error) {
        console.error("Error en el login:", error);
        if (error.response && error.response.status === 401) {
            throw new Error("Credenciales inválidas. Inténtalo de nuevo.");
        }
        throw new Error("No se pudo conectar al servidor de login.");
    }
};

/**
 * Cierra la sesión (elimina el token del cliente).
 */
const logout = async () => {
    try {
        // Eliminamos el token del almacenamiento local
        localStorage.removeItem('token');
        return { message: "Logout exitoso" };
    } catch (error) {
        console.error("Error en el logout:", error);
        throw new Error("Error al cerrar sesión.");
    }
};

export default {
    login,
    logout
};