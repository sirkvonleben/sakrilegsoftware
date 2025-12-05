import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    // 1. INICIALIZACIÓN: Leemos del localStorage si existe, si no, array vacío
    const [notifications, setNotifications] = useState(() => {
        const savedData = localStorage.getItem('app_notifications');
        return savedData ? JSON.parse(savedData) : [];
    });

    // 2. PERSISTENCIA: Cada vez que 'notifications' cambie, guardamos en localStorage
    useEffect(() => {
        localStorage.setItem('app_notifications', JSON.stringify(notifications));
    }, [notifications]);

    // Agregar notificación
    const addNotification = (mensaje, tipo = 'INFO') => {
        const newNotif = {
            id: Date.now(), // ID único basado en tiempo
            mensaje,
            tipo, // 'INFO', 'SUCCESS', 'ALERT'
            fecha: new Date().toISOString() // Guardamos como string para que JSON no rompa
        };
        // Agregamos al principio
        setNotifications((prev) => [newNotif, ...prev]);
    };

    // Limpiar notificaciones
    const clearNotifications = () => {
        setNotifications([]);
        localStorage.removeItem('app_notifications');
    };

    // Helper para formatear fechas (ya que del storage vuelven como string)
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Justo ahora' : date.toLocaleTimeString();
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications, formatTime }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);