// frontend/src/modules/Users/views/UserList.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userApi from '../../../api/userApi';
import InfoModal from '../../../components/modals/InfoModal';
// --- 1. IMPORTAR EL HOOK DE AUTENTICACIÓN ---
import { useAuth } from '../../../context/AuthContext'; 

// --- Función Helper para Roles (Sin cambios) ---
const getRolClass = (rolNombre) => {
    if (!rolNombre) return 'rol-default';
    switch (rolNombre.toUpperCase()) {
        case 'ADMINISTRADOR':
            return 'rol-admin';
        case 'JEFE_ALMACEN':
            return 'rol-jefe';
        case 'OPERADOR':
            return 'rol-operador';
        default:
            return 'rol-default';
    }
};

// --- 2. COMPONENTE DE TABLA ACTUALIZADO ---
// Ahora recibe 'userRole' y 'onAnular'
const UserTable = ({ users, onViewInfo, onAnular, userRole }) => (
    
    <div className="overflow-x-auto mt-4">
        <table className="w-full min-w-[900px] text-left border-collapse">
            <thead className="border-b-2 border-gray-300 bg-gray-100">
                <tr>
                    <th className="p-4">Nombre U</th>
                    <th className="p-4">Estado U</th>
                    <th className="p-4">Cargo U</th> 
                    <th className="p-4">Rol U (RF-02)</th>
                    <th className="p-4"># Celular U</th>
                    <th className="p-4">Acción</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                         <td className="p-4 font-medium">{user.nombre} {user.apellido}</td>
                        <td className="p-4">
                            <span className={`table-badge ${user.estado ? 'estado-activo' : 'estado-anulado'}`}>
                                {user.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td className="p-4">{user.cargo || 'N/A'}</td>
                        <td className="p-4">
                            <span className={`table-badge ${getRolClass(user.rol?.nombre)}`}>
                                {user.rol?.nombre || 'S/R'}
                            </span>
                        </td>
                        <td className="p-4">{user.celular}</td>
                       
                         {/* --- 3. ACCIONES CON LÓGICA DE ROLES --- */}
                         <td className="p-4 flex space-x-3">
                            {/* Botón Ver Info (Todos) */}
                            <button onClick={() => onViewInfo(user)} title="Ver Info Secundaria">
                                 <svg className="h-6 w-6 text-gray-500 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
                            </button>

                             {/* Botón Editar (Todos los admins) */}
                            <Link to={`/usuarios/editar/${user.id}`} title="Editar Usuario">
                                <svg className="h-6 w-6 text-gray-500 hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </Link>

                            {/* Botón Anular (Solo ADMIN y si el usuario está ACTIVO) */}
                            {(userRole === 'ADMINISTRADOR' && user.estado === true) && (
                                <button onClick={() => onAnular(user)} title="Anular (Desactivar) Usuario">
                                    {/* (Usamos un ícono de "prohibido" o "basura") */}
                                    <svg className="h-6 w-6 text-red-400 hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
             </tbody>
        </table>
    </div>
);

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [infoModalUser, setInfoModalUser] = useState(null);

    // --- 4. OBTENER INFO DE USUARIO ---
    const { usuario } = useAuth();
    const userRole = usuario?.rol?.nombre || 'OPERADOR'; // Fallback seguro

    // Función para obtener datos del Backend
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userApi.getAllUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError("Error: Fallo la conexión con el Backend (Spring Boot: 8090).");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- 5. NUEVA FUNCIÓN 'handleAnularUsuario' ---
    const handleAnularUsuario = async (user) => {
        if (window.confirm(`¿Estás seguro de ANULAR (desactivar) al usuario "${user.nombre} ${user.apellido}" (ID: ${user.id})?`)) {
            try {
                // Usamos la API de userApi (DELETE)
                await userApi.deactivateUser(user.id);
                alert('Usuario anulado (desactivado) con éxito.');
                fetchUsers(); // Refresca la lista de usuarios
            } catch (err) {
                console.error("Error al anular usuario:", err);
                alert("Error al anular el usuario. " + (err.message || ""));
            }
        }
    };

    // --- CÁLCULOS DEL FOOTER (Sin cambios) ---
    const activos = users.filter(u => u.estado === true).length;
    const inactivos = users.filter(u => u.estado === false).length;
    
    const rolesCount = users.reduce((acc, user) => {
        const rolNombre = user.rol?.nombre || 'Indefinido';
        acc[rolNombre] = (acc[rolNombre] || 0) + 1;
        return acc;
    }, {});
    const total = users.length;
    
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h2>
            
            {/* Acciones Superiores (Sin cambios) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <Link to="/usuarios/crear" className="bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold rounded-lg px-5 py-2 transition-colors shadow-md">
                    Crear Usuario
                </Link>
                <div className="search-bar w-full md:w-2/5 border-2 border-gray-300 rounded-lg p-2 flex items-center bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Ingresar Usuario a buscar..." className="border-none outline-none w-full pl-2" />
                </div>
            </div>

            {loading ? (
                <p className="text-center p-8 text-blue-600">Cargando datos...</p>
            ) : (
                <>
                    {error && <p className="text-center p-2 bg-red-100 text-red-700 border border-red-300 rounded-lg">{error}</p>}
                    
                    {/* --- 6. PASAR PROPS A LA TABLA --- */}
                    <UserTable 
                        users={users} 
                        onViewInfo={setInfoModalUser} 
                        onAnular={handleAnularUsuario}
                        userRole={userRole}
                    />
                </>
            )}

            {/* Footer (Sin cambios) */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200 text-gray-600">
                 <div>
                    <p><span className="font-bold">Activos Registros:</span> {activos}</p>
                    <p><span className="font-bold">Inactivo Registros:</span> {inactivos}</p>
                </div>
                <div>
                     <p><span className="font-bold">Admin:</span> {rolesCount['ADMINISTRADOR'] || 0}</p>
                    <p><span className="font-bold">Asistente:</span> {rolesCount['OPERADOR'] || 0}</p>
                    <p><span className="font-bold">Jefe Almacén:</span> {rolesCount['JEFE_ALMACEN'] || 0}</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-gray-800">Total de Registros: {total}</p>
                </div>
            </div>

            {/* Modal de Info (Sin cambios) */}
            {infoModalUser && (
                <InfoModal 
                    user={infoModalUser} 
                    onClose={() => setInfoModalUser(null)} 
                />
             )}
        </div>
    );
};

export default UserList;