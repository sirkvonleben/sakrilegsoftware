// frontend/src/modules/Movements/views/SalidaForm.jsx

import React, { useState, useEffect } from 'react'; // <-- ¡useEffect añadido!
import { Link, useNavigate } from 'react-router-dom';
import salidaApi from '../../../api/salidaApi';
// --- ¡APIs REALES IMPORTADAS! ---
import productoApi from '../../../api/productoApi';
import sucursalApi from '../../../api/sucursalApi';

// --- (Estilos sin cambios) ---
const inputStyles = "form-select w-full bg-green-50 border border-green-300 text-gray-900 rounded-lg p-3 shadow-sm focus:border-green-600 focus:ring-1 focus:ring-green-400 outline-none transition-colors duration-200";
const textInputStyles = "form-input w-full bg-green-50 border border-green-300 text-gray-900 rounded-lg p-3 shadow-sm focus:border-green-600 focus:ring-1 focus:ring-green-400 outline-none transition-colors duration-200";
const btnAddStyles = "bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold rounded-lg px-5 py-2 transition-colors shadow-md";
const btnRemoveStyles = "bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 px-4 rounded-lg transition-colors shadow-md";


const SalidaForm = ({ mode }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Estados para el formulario (Cabecera) ---
    const [sucursalId, setSucursalId] = useState('');
    const [usuarioId, setUsuarioId] = useState(3); // (Simulado)
    const [motivo, setMotivo] = useState('');
    const [destino, setDestino] = useState(''); 

    // --- Estados para el formulario (Detalles) ---
    const [detalles, setDetalles] = useState([
        { productoId: '', cantidad: 1, precioUnitario: 0.0 }
    ]);

    // --- ¡NUEVO! ESTADOS PARA DATOS REALES ---
    const [productos, setProductos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    
    // --- ¡NUEVO! useEffect para cargar datos ---
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [productosData, sucursalesData] = await Promise.all([
                    productoApi.getAllProductos(),
                    sucursalApi.getAllSucursales()
                ]);
                
                setProductos(productosData);
                setSucursales(sucursalesData);

                if (sucursalesData.length > 0) {
                     setSucursalId(sucursalesData[0].id);
                }

            } catch (err) {
                setError("Error al cargar productos o sucursales. " + err.message);
            }
        };
        
        cargarDatos();
    }, []); // El array vacío [] asegura que esto solo se ejecute una vez.
    

    // --- (Lógica de Detalles y Submit no cambian) ---
    const handleDetalleChange = (index, event) => {
        const values = [...detalles];
        values[index][event.target.name] = event.target.value;
        setDetalles(values);
    };

    const addDetalle = () => {
        setDetalles([...detalles, { productoId: '', cantidad: 1, precioUnitario: 0.0 }]);
    };

    const removeDetalle = (index) => {
        const values = [...detalles];
        values.splice(index, 1);
        setDetalles(values);
    };

    const handleSubmit = async (e) => {
        // ... (Tu lógica de handleSubmit no necesita cambios)
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        if (!sucursalId || parseInt(sucursalId) === 0) {
            setError("Error: Debes seleccionar una sucursal de salida.");
            setLoading(false);
            return; 
        }

        const detallesFormateados = detalles.map(d => ({
            id_producto: parseInt(d.productoId), // <-- CAMBIO AQUÍ: Nombre de campo correcto
            cantidad: parseInt(d.cantidad),
            precioUnitario: parseFloat(d.precioUnitario)
        }));

        const notaSalidaData = {
            motivo: motivo,
            destino: destino,
            estado: "ACTIVO",
            usuario: { id: usuarioId },
            sucursal: { id: parseInt(sucursalId) },
            detalles: detallesFormateados
        };

        try {
            await salidaApi.registrarSalida(notaSalidaData);
            alert('¡Nota de Salida creada con éxito! El stock ha sido actualizado.');
            navigate('/movimientos'); 
        } catch (err) {
            console.error(err);
            setError("Error al guardar: " + (err.response?.data?.message || "Fallo de conexión o Stock insuficiente (RF-08)."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container p-6 md:p-10">
            {/* ... (Cabecera y botón Regresar no cambian) ... */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Crear Nota de Salida</h2>
                <Link to="/movimientos" className="text-[#dd6b20] hover:bg-[#fef3c7] hover:text-[#c05621] font-semibold p-2 rounded-md transition-colors">
                    REGRESAR
                </Link>
            </div>

            {error && <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-xl font-semibold px-2">Datos de Cabecera</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        {/* --- ¡SELECT DE SUCURSAL ACTUALIZADO! --- */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal de Salida</label>
                            <select 
                                value={sucursalId} 
                                onChange={(e) => setSucursalId(e.target.value)} 
                                required 
                                className={inputStyles}
                            >
                                <option value="">Seleccionar sucursal...</option>
                                {/* Mapeamos sobre los datos REALES */}
                                {sucursales.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>
                        {/* ... (Motivo y Destino no cambian) ... */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                            <select value={motivo} onChange={(e) => setMotivo(e.target.value)} required className={inputStyles}>
                                <option value="">Seleccionar motivo...</option>
                                <option value="VENTA">Venta</option>
                                <option value="REPOSICION">Reposición</option>
                                <option value="MERMA">Merma</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Destino (Cliente/Sede)</label>
                            <input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} className={textInputStyles} placeholder="Ej: Cliente RUC 10..." />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-lg">
                    <legend className="text-xl font-semibold px-2">Detalle de Productos</legend>
                    
                    {detalles.map((detalle, index) => (
                        <div key={index} className="grid grid-cols-10 gap-4 mb-4 p-2 border-b items-center">
                            {/* --- ¡SELECT DE PRODUCTO ACTUALIZADO! --- */}
                            <div className="col-span-10 md:col-span-4">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Producto</label>
                                <select 
                                    name="productoId" 
                                    value={detalle.productoId} 
                                    onChange={e => handleDetalleChange(index, e)} 
                                    required 
                                    className={inputStyles}
                                >
                                    <option value="">Seleccionar...</option>
                                    {/* Mapeamos sobre los datos REALES */}
                                    {productos.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre} ({p.codigo})</option>
                                    ))}
                                </select>
                            </div>
                            {/* ... (Cantidad, Precio, Eliminar no cambian) ... */}
                            <div className="col-span-5 md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad</label>
                                <input 
                                    type="number" 
                                    name="cantidad" 
                                    value={detalle.cantidad} 
                                    onChange={e => handleDetalleChange(index, e)} 
                                    required 
                                    className={textInputStyles}
                                    min="1"
                                />
                            </div>
                            <div className="col-span-5 md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Precio Unit. (S/)</label>
                                <input 
                                    type="number" 
                                    name="precioUnitario" 
                                    value={detalle.precioUnitario} 
                                    onChange={e => handleDetalleChange(index, e)} 
                                    className={textInputStyles}
                                    step="0.01"
                                />
                            </div>
                            <div className="col-span-10 md:col-span-2 flex items-end justify-end md:mt-6">
                                <button type="button" onClick={() => removeDetalle(index)} className={btnRemoveStyles} title="Eliminar Fila">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    <button type="button" onClick={addDetalle} className={btnAddStyles}>
                        Añadir Producto
                    </button>
                </fieldset>

                {/* ... (Botón Guardar no cambia) ... */}
                <div className="flex justify-end mt-8">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold rounded-lg px-6 py-2 transition-colors shadow-lg"
                    >
                        {loading ? 'Guardando...' : 'GUARDAR SALIDA'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SalidaForm;