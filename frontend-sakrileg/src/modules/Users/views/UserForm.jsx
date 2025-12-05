// frontend/src/modules/Users/views/UserForm.jsx

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import userApi from '../../../api/userApi';
import sucursalApi from '../../../api/sucursalApi'; // <-- 1. IMPORTADO
import SuccessModal from '../../../components/modals/SuccessModal';

// --- Constante de Roles ---
const ROLES_DISPONIBLES = [
    { id: 1, nombre: 'ADMINISTRADOR' },
    { id: 2, nombre: 'JEFE_ALMACEN' },
    { id: 3, nombre: 'OPERADOR' }
];

// --- 2. CONSTANTE SUCURSALES ELIMINADA ---

// --- Estado Inicial ---
const initialState = {
    nombre: '',
    apellido: '',
    login: '',
    password: '',
    rolId: '',
    sucursalId: '', 
    estado: 'true', 
    correo: '',
    celular: '',
    cargo: ''
};

// --- NUEVAS FUNCIONES HELPER PARA ESTILO ---
// Formatea el ID como UC00001
const formatUserCode = (id) => `UC${String(id).padStart(5, '0')}`;
// Formatea la fecha como DD/MM/AAAA
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// --- Definición de clases de Tailwind para los inputs ---
const inputStyles = "bg-green-50 border border-green-300 text-gray-900 rounded-lg p-3 w-full focus:border-green-600 focus:ring-1 focus:ring-green-400 outline-none transition-colors duration-200";

const UserForm = ({ mode }) => {
    const { id } = useParams();
    const navigate = useNavigate(); 

    const [formData, setFormData] = useState(initialState);
    const [sucursales, setSucursales] = useState([]); // <-- 3. ESTADO AÑADIDO
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [fechaCreacion, setFechaCreacion] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const title = mode === 'crear' ? 'Crear Nuevo Usuario' : `Editar Usuario #${id}`;

    // --- 4. USEEFFECT ACTUALIZADO ---
    useEffect(() => {
        
        // Función para cargar datos maestros (Sucursales)
        const fetchMasterData = async () => {
            try {
                // Pedimos las sucursales a la API
                const sucursalesData = await sucursalApi.getAllSucursales();
                setSucursales(sucursalesData);
            } catch (err) {
                console.error("Error al cargar sucursales:", err);
                setStatus('error'); // Reutilizamos el estado de error
            }
        };
        
        fetchMasterData(); // Llamamos a la función de carga

        // Lógica para cargar el usuario en modo edición
        if (mode === 'editar' && id) {
            const fetchUser = async () => {
                setLoading(true);
                try {
                    const user = await userApi.getUserById(id);
         
                    setFormData({
                        nombre: user.nombre,
                        apellido: user.apellido,
                        login: user.login,
                        rolId: user.rol.id,
                        sucursalId: user.sucursal.id,
                        estado: user.estado.toString(),
                        correo: user.correo,
                        celular: user.celular,
                        cargo: user.cargo || '', 
                    });
                    setFechaCreacion(user.fechaCreacion);
                } catch (err) {
                    console.error("Error al cargar usuario:", err);
                    setStatus('error');
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        } else {
            // Modo crear
            setFormData(initialState);
            setFechaCreacion(null);
        }
    }, [mode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.sucursalId || !formData.rolId) {
            setStatus('error');
            return;
        }

        setLoading(true);
        setStatus(null);

        const dataParaApi = {
            ...formData,
            rol: { id: parseInt(formData.rolId) },
            sucursal: { id: parseInt(formData.sucursalId) }, 
            estado: formData.estado === 'true'
        };

        delete dataParaApi.rolId;
        delete dataParaApi.sucursalId; 

        try {
            if (mode === 'crear') {
                await userApi.createUser(dataParaApi);
                setSuccessMessage('¡Usuario creado con éxito!');
            } else {
                await userApi.updateUser(id, dataParaApi);
                setSuccessMessage('¡Usuario actualizado con éxito!');
            }
            setShowSuccessModal(true);
        } catch (error) {
            setStatus('error');
            console.error('Error al guardar:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/usuarios'); 
    };

    if (loading && mode === 'editar') return <p className="text-center p-8">Cargando datos del usuario...</p>;

    return (
        <div className="main-container p-6 md:p-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                <Link to="/usuarios" className="text-[#dd6b20] hover:bg-[#fef3c7] hover:text-[#c05621] font-semibold p-2 rounded-md transition-colors">
                    REGRESAR
                </Link>
            </div>

            {status === 'error' && <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">Ocurrió un error. Revisa que todos los campos (incluyendo Rol y Sucursal) estén completos.</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna Izquierda: Campos del formulario */}
                <div className="md:col-span-2 grid grid-cols-2 gap-6">

                    {/* Campo Nombre */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                         <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className={inputStyles} />
                    </div>
                    {/* Campo Apellido */}
                    <div>
                        <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                        <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required className={inputStyles} />
                    </div>
                    {/* Campo Correo */}
                    <div>
                        <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                        <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} required className={inputStyles} />
                    </div>
                    {/* Campo Celular */}
                    <div>
                        <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                        <input type="tel" id="celular" name="celular" value={formData.celular} onChange={handleChange} required className={inputStyles} />
                    </div>
                    
                    {/* Campo Cargo */}
                    <div>
                        <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                        <input 
                            type="text" 
                            id="cargo" 
                            name="cargo" 
                            value={formData.cargo} 
                            onChange={handleChange} 
                            placeholder="Ej: Project Manager"
                            className={inputStyles}
                        />
                    </div>

                    {/* Campo Rol (RF-02) */}
                    <div>
                        <label htmlFor="rolId" className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                        <select id="rolId" name="rolId" value={formData.rolId} onChange={handleChange} required className={inputStyles}>
                            <option value="">Seleccionar rol...</option>
                            {ROLES_DISPONIBLES.map(rol => (
                                <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* --- 5. DROPDOWN DE SUCURSAL ACTUALIZADO --- */}
                    <div>
                        <label htmlFor="sucursalId" className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
                        <select id="sucursalId" name="sucursalId" value={formData.sucursalId} onChange={handleChange} required className={inputStyles}>
                            <option value="">Seleccionar sucursal...</option>
                            {/* Ahora mapea desde el estado 'sucursales' cargado de la API */}
                            {sucursales.map(suc => (
                                <option key={suc.id} value={suc.id}>{suc.nombre}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Campo Estado */}
                    <div>
                         <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select id="estado" name="estado" value={formData.estado} onChange={handleChange} required className={inputStyles}>
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>
                    
                   
                    {/* Campo Login */}
                    <div>
                        <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">Usuario Login</label>
                        <input type="text" id="login" name="login" value={formData.login} onChange={handleChange} required className={inputStyles} />
                     </div>
                    
                    {/* Campo Contraseña (Solo en Crear) */}
                    {mode === 'crear' && (
                         <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required={mode === 'crear'} className={inputStyles} />
                        </div>
                    )}
                </div>

                {/* Columna Derecha: Info */}
                <div className="md:col-span-1 space-y-6">
                    {/* --- CAMBIO DE ESTILO: Borde punteado --- */}
                     <div className="h-32 bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-400">
                        {/* (Aquí podrías poner un ícono) */}
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>

                    {/* --- CAMBIO DE ESTILO: Info box como el prototipo --- */}
                    {mode === 'editar' && (
                         <div className="p-4 bg-gray-100 rounded-lg space-y-3">
                            <p className="flex justify-between">
                                <span className="font-medium text-gray-700">User code:</span> 
                                 <span className="font-bold text-gray-900">{formatUserCode(id)}</span>
                            </p>
                            {fechaCreacion && (
                                <p className="flex justify-between">
                                    <span className="font-medium text-gray-700">Fecha creacion:</span> 
                                    <span className="font-bold text-gray-900">
                                         {formatDate(fechaCreacion)}
                                    </span>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Botón Guardar */}
                <div className="col-span-full flex justify-end mt-8">
                    <button type="submit" disabled={loading} className={`bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold rounded-lg px-6 py-2 transition-colors shadow-lg ${loading && 'opacity-50 cursor-not-allowed'}`}>
                        {loading ? 'Guardando...' : (mode === 'crear' ? 'GUARDAR' : 'ACTUALIZAR')}
                    </button>
                </div>
            </form>

            {/* Modal de Éxito */}
            {showSuccessModal && (
                <SuccessModal
                    message={successMessage}
                    onClose={handleCloseSuccessModal}
                />
            )}
        </div>
    );
};

export default UserForm;