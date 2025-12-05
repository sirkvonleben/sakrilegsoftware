import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
// Importamos los paneles laterales que creamos antes
import NotificationPanel from './NotificationPanel';
import UserProfileDrawer from './UserProfileDrawer';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Estados para paneles laterales
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

    // 1. LEER DATOS REALES DEL USUARIO (Guardados en el Login)
    const userName = localStorage.getItem('userName') || 'Usuario';
    const userRole = localStorage.getItem('userRole') || 'Invitado';

    // Lógica de Logout
    const handleLogout = async () => {
        await authApi.logout();
        navigate('/login');
    };

    // Configuración de Navegación
    const navItems = [
        { name: 'Gestión de Usuarios', path: '/usuarios' },
        { name: 'Movimientos de Inventario', path: '/movimientos' },
        { name: 'Catálogo y Stock', path: '/catalogo' },
    ];

    // Helper para color del Rol en el perfil
    const getRoleBadgeColor = (role) => {
        if (role === 'ADMINISTRADOR') return 'bg-purple-100 text-purple-700 border-purple-300';
        if (role === 'JEFE_ALMACEN') return 'bg-blue-100 text-blue-700 border-blue-300';
        return 'bg-green-100 text-green-700 border-green-300'; // Operador
    };

    return (
        <div className="relative min-h-screen bg-[#fefbec] flex flex-col">
            
            {/* --- HEADER SUPERIOR (Fijo) --- */}
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 shadow-sm fixed w-full z-30 top-0">
                
                {/* Izquierda: Notificaciones y Logo */}
                <div className="flex items-center space-x-4">
                     <button 
                        onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none relative"
                        title="Ver Notificaciones"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    
                    <h1 className="text-xl font-bold text-[#2f855a] hidden md:block">
                        LegosX<span className="text-gray-400 font-normal">App</span>
                    </h1>
                </div>

                {/* Centro: Barra de Navegación (Tabs) */}
                <nav className="hidden md:flex flex-wrap gap-2 bg-[#c6f6d5]/30 p-1 rounded-lg">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all duration-200
                                ${location.pathname.startsWith(item.path) 
                                    ? 'bg-[#38a169] text-white shadow-sm' 
                                    : 'text-[#2f855a] hover:bg-[#b2f5ea] hover:text-[#276749]'}`
                            }
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Derecha: Perfil y Logout */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsRightPanelOpen(true)}
                        className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded-lg transition-colors text-right"
                    >
                        <div className="hidden md:block">
                            <p className="text-sm font-bold text-gray-800">{userName}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRoleBadgeColor(userRole)} font-bold`}>
                                {userRole}
                            </span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[#c6f6d5] border-2 border-[#38a169] flex items-center justify-center text-[#2f855a] font-bold text-lg">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </button>




                    {/*<button 
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                        title="Salir del sistema"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>*/}



                </div>
            </header>

            {/* --- PANELES LATERALES --- */}
            <NotificationPanel isOpen={isLeftPanelOpen} toggle={() => setIsLeftPanelOpen(false)} />
            <UserProfileDrawer isOpen={isRightPanelOpen} toggle={() => setIsRightPanelOpen(false)} />
            
            {/* Overlay */}
            {(isLeftPanelOpen || isRightPanelOpen) && (
                <div className="fixed inset-0 bg-black bg-opacity-25 z-20" onClick={() => { setIsLeftPanelOpen(false); setIsRightPanelOpen(false); }}></div>
            )}

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="pt-20 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full flex-grow transition-all duration-300">
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 min-h-[80vh]">
                    <Outlet /> 
                </div>
            </main>
            
             <footer className="text-center py-4 text-gray-400 text-xs">
                © 2025 LegosX - Sistema de Gestión de Inventario
            </footer>
        </div>
    );
};

export default Layout;