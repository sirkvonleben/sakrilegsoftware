import React from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';

const UserProfileDrawer = ({ isOpen, toggle }) => {
    const navigate = useNavigate();

    // 1. OBTENER DATOS REALES (Desde el LocalStorage)
    // Si no encuentra el nombre, pone "Usuario" por defecto
    const userName = localStorage.getItem('userName') || 'Usuario';
    
    // Obtenemos la inicial para el avatar
    const initial = (userName && userName.length > 0) ? userName.charAt(0).toUpperCase() : 'U';

    // 2. LÓGICA DE CERRAR SESIÓN
    const handleLogout = async () => {
        try {
            await authApi.logout();
            navigate('/login'); // Redirige al login
        } catch (error) {
            console.error("Error al salir:", error);
            navigate('/login'); // Forzar salida aunque falle la API
        }
    };

    return (
        <>
            {/* Overlay (Fondo oscuro) para cerrar al hacer clic fuera */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-25 z-30 transition-opacity" 
                    onClick={toggle}
                ></div>
            )}

            {/* Panel Deslizante */}
            <div className={`fixed inset-y-0 right-0 z-40 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* --- HEADER (Verde) --- */}
                <div className="p-6 bg-[#38a169] text-white">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xl">Mi Perfil</h3>
                        <button onClick={toggle} className="text-white hover:text-gray-200 text-xl font-bold">
                            ✕
                        </button>
                    </div>
                    
                    {/* Info del Usuario */}
                    <div className="mt-6 flex items-center">
                        {/* Avatar con Inicial Dinámica */}
                        <div className="h-16 w-16 rounded-full bg-white text-[#38a169] flex items-center justify-center font-bold text-3xl border-4 border-[#b2f5ea] shadow-sm">
                            {initial}
                        </div>
                        <div className="ml-4">
                            {/* Nombre Real */}
                            <p className="font-bold text-lg leading-tight">{userName}</p>
                            {/* Texto "Conectado" (Reemplazando el Rol como pediste) */}
                            <div className="flex items-center mt-1">
                                <span className="h-2 w-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                                <p className="text-xs text-green-100 uppercase tracking-wider">En Línea</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CUERPO DEL PANEL --- */}
                <div className="p-6 flex flex-col h-[calc(100%-180px)] justify-between">
                    
                    {/* Sección Superior: Opciones */}
                    <div className="space-y-4">
                        {/* Botón Cambiar Contraseña (Visual) */}
                        <button className="w-full flex items-center p-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 group">
                            <div className="p-2 bg-white rounded-lg border border-gray-100 mr-3 group-hover:border-green-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-[#38a169]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 19l-1 1-6-6 1-1 3.429-3.429A6 6 0 0121 9z" />
                                </svg>
                            </div>
                            <span className="font-medium">Cambiar Contraseña</span>
                        </button>

                        {/* Aquí podrías agregar más botones en el futuro (Editar perfil, Preferencias, etc.) */}
                    </div>

                    {/* Sección Inferior: Cerrar Sesión */}
                    <div className="border-t border-gray-100 pt-6">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>CERRAR SESIÓN</span>
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">Versión 1.0.0</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfileDrawer;