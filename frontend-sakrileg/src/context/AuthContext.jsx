// frontend-sakrileg/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import authApi from '../api/authApi'; // Importamos la API que ya modificamos

// 1. Crear el Contexto
const AuthContext = createContext(null);

// 2. Crear el Proveedor (El componente que maneja la lógica)
export const AuthProvider = ({ children }) => {
    
    // El estado 'usuario' almacenará los datos (o null si no está logueado)
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true); // Para saber si estamos verificando la sesión

    // Este useEffect se ejecuta 1 sola vez al cargar la app
    // Intenta cargar al usuario desde localStorage por si ya tenía sesión
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('legosxapp_user');
            if (storedUser) {
                setUsuario(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error al cargar usuario desde localStorage", error);
            localStorage.removeItem('legosxapp_user');
        }
        setLoading(false); // Terminamos de cargar
    }, []);

    // Función de Login
    const login = async (login, password) => {
        try {
            // 1. Llama a la API (que ahora devuelve el objeto Usuario)
            const userData = await authApi.login(login, password);
            
            // 2. Guarda el usuario en el estado de React
            setUsuario(userData);
            
            // 3. Guarda el usuario en localStorage para persistir la sesión
            localStorage.setItem('legosxapp_user', JSON.stringify(userData));
            
        } catch (error) {
            // Si la API falla, lanzamos el error para que LoginPage.jsx lo muestre
            console.error("Error en AuthContext login:", error);
            throw error;
        }
    };

    // Función de Logout
    const logout = async () => {
        try {
            // 1. Llama a la API del backend para invalidar la sesión
            await authApi.logout(); 
        } catch (error) {
            console.error("Error en AuthContext logout:", error);
            // No detenemos el logout del frontend aunque la API falle
        } finally {
            // 2. Limpia el estado de React
            setUsuario(null);
            // 3. Limpia el localStorage
            localStorage.removeItem('legosxapp_user');
        }
    };

    // 3. El valor que compartiremos con toda la app
    const value = {
        usuario,
        loading,
        login,
        logout
    };

    // Retornamos el proveedor "envolviendo" a los children (nuestra App)
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 4. Hook personalizado
// Esto permite que cualquier componente llame a useAuth() 
// para acceder a { usuario, login, logout }
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};