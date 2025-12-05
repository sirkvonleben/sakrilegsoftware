// frontend/src/components/layout/Layout.jsx

import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

// --- 1. IMPORTACIÓN CORREGIDA ---
// 'useAuth' se importa desde el Contexto, no desde la API
import { useAuth } from '../../context/AuthContext'; 

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // --- 2. OBTENER EL USUARIO Y LA FUNCIÓN 'logout' DEL CONTEXTO ---
    const { usuario, logout: authLogout } = useAuth(); // Renombramos 'logout'

    // Definimos las rutas de navegación base
    const navItems = [
        { name: 'Movimientos de Inventario', path: '/movimientos', roles: ['ADMINISTRADOR', 'JEFE_ALMACEN', 'OPERADOR'] },
        { name: 'Catálogo y Stock', path: '/catalogo', roles: ['ADMINISTRADOR', 'JEFE_ALMACEN', 'OPERADOR'] },
    ];

    // --- 3. LÓGICA DE PERMISOS ---
    // Añadimos dinámicamente la pestaña "Gestión de Usuarios" solo si el rol es ADMIN
    const permittedNavItems = [...navItems];
    if (usuario?.rol?.nombre === 'ADMINISTRADOR') { 
        permittedNavItems.unshift({
            name: 'Gestión de Usuarios',
            path: '/usuarios',
            roles: ['ADMINISTRADOR']
        });
    }

    // --- 4. ACTUALIZAR EL MANEJADOR DE LOGOUT ---
    const handleLogout = async () => {
        try {
            await authLogout(); // Llama a la función del contexto
            navigate('/login');   // Redirige a la página de login
        } catch (error) {
            console.error(error);
            navigate('/login');   // Redirige igualmente
        }
    };

    return (
        <div className="p-4 md:p-8 bg-amber-50 min-h-screen"> 
            <div className="max-w-7xl mx-auto">
                
                <nav className="flex justify-between items-center p-2 bg-[#c6f6d5] rounded-lg shadow-md">
     
                   {/* --- 5. NAVEGACIÓN BASADA EN PERMISOS --- */}
                    <div className="flex flex-wrap space-x-2">
                        {/* Mapeamos sobre la nueva lista 'permittedNavItems' */}
                        {permittedNavItems.map((item) => (
                            <Link 
                                 key={item.path} 
                                to={item.path} 
                                className={`px-5 py-2 font-semibold rounded-md transition-all duration-300 
                                    ${location.pathname.startsWith(item.path) 
                                        ? 'bg-[#38a169] text-white shadow-lg' 
                                        : 'text-[#2f855a] hover:bg-[#b2f5ea]'}`
                                }
                            >
                                 {item.name}
                            </Link>
                        ))}
                    </div>
            
                    {/* Botón de Logout (ya funciona con el contexto) */}
                    <button 
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-4 py-2 transition-colors shadow-lg mr-2"
                    >
                         Cerrar Sesión
                    </button>
                </nav>

                {/* Contenedor principal */}
                <div className="main-container p-6 mt-6 bg-white border border-gray-200 rounded-xl shadow-lg">
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default Layout;