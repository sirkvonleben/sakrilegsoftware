// frontend/src/modules/Catalog/views/CatalogoStockList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import inventarioApi from '../../../api/inventarioApi'; 

import productoApi from '../../../api/productoApi'; // <-- 1. Importamos la API actualizada
import trackingApi from '../../../api/trackingApi'; 
import sucursalApi from '../../../api/sucursalApi';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
// --- Modales ---
import InventarioInfoModal from './InventarioInfoModal'; 
import ProductoInfoModal from './ProductoInfoModal';
import ProductoFormModal from './ProductoFormModal';
import TrackingInfoModal from './TrackingInfoModal';



// (TABS, Constantes y Helpers sin cambios)
const TABS = { INVENTARIO: 'inventario', MAESTRO: 'maestro', TRACKING: 'tracking' };
const ESTADOS_TRACKING_SIMULADOS = ['Todos los Estados', 'En Tránsito', 'Entregado', 'Pendiente'];
const filterInputStyles = "w-full md:w-2/5 border-2 border-gray-300 rounded-lg p-2 flex items-center bg-white shadow-sm";
const filterSelectStyles = "form-select w-full md:w-1/5 border-2 border-gray-300 rounded-lg p-2 bg-white shadow-sm focus:border-green-600 focus:ring-1 focus:ring-green-400 outline-none";
const SearchBarGenerica = ({ placeholder }) => (
    <div className={filterInputStyles}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" placeholder={placeholder} className="border-none outline-none w-full pl-2" />
    </div>
);
const getColorClass = (colorNombre) => {
    if (!colorNombre) return 'color-default';
    switch (colorNombre.toUpperCase()) {
        case 'ROJO': return 'color-rojo';
        case 'AZUL': return 'color-azul';
        case 'BLANCO': return 'color-blanco';
        case 'NEGRO': return 'color-negro';
        case 'VERDE': return 'color-verde';
        default: return 'color-default';
    }
};
const getTrackingStatusClass = (status) => {
    switch (status) {
        case 'En Tránsito': return 'tracking-transito';
        case 'Entregado': return 'tracking-entregado';
        case 'Pendiente': return 'tracking-pendiente';
        default: return 'rol-default';
    }
};
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString.replace(/-/g, '/'));
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};


const CatalogoStockList = () => {
    const { addNotification, notifications } = useNotification();
    const [activeTab, setActiveTab] = useState(TABS.INVENTARIO);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminLoading, setAdminLoading] = useState(false); // Estado de carga para Admin

    const { usuario } = useAuth();
    const userRole = usuario?.rol?.nombre || 'OPERADOR'; 

    const [inventario, setInventario] = useState([]);
    const [productos, setProductos] = useState([]);
    const [trackingData, setTrackingData] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursalId, setSelectedSucursalId] = useState(0);
    const [selectedTrackingEstado, setSelectedTrackingEstado] = useState('Todos los Estados');
    const [inventarioInfoItem, setInventarioInfoItem] = useState(null);
    const [productoInfoItem, setProductoInfoItem] = useState(null);
    const [productoFormItem, setProductoFormItem] = useState(null); 
    const [isCreatingProducto, setIsCreatingProducto] = useState(false);
    const [trackingInfoItem, setTrackingInfoItem] = useState(null);

    // (fetchData sin cambios)
    const fetchData = async () => {
        // (No recargar si el admin está creando)
        if (adminLoading) return; 

        setLoading(true);
        try {
            const [inventarioData, productosData, trackingData, sucursalesData] = await Promise.all([
                inventarioApi.getAllInventario(),
                productoApi.getAllProductos(),
                trackingApi.getAllTracking(),
                sucursalApi.getAllSucursales()
            ]);
            setInventario(inventarioData);
            inventarioData.forEach(item => {
                if (item.stockActual < item.stockMinimo) {
                    const mensajeAlerta = `STOCK BAJO CRÍTICO: ${item.producto.nombre} en ${item.sucursal.nombre} (Hay ${item.stockActual}, Mín ${item.stockMinimo})`;
                    
                    // Verificamos si ya existe esta alerta recientemente para no spammear
                    // (Opcional: puedes quitar el if si quieres que avise siempre al recargar)
                    const yaExiste = notifications.some(n => n.mensaje === mensajeAlerta && n.tipo === 'ALERT');
                    
                    if (!yaExiste) {
                        // Agregamos la alerta
                        addNotification(mensajeAlerta, 'ALERT');
                    }
                }
            });


            setProductos(productosData);
            setTrackingData(trackingData); 
            setSucursales(sucursalesData);
            setError(null);
        } catch (err) {
            console.error("Error al cargar datos:", err);
            setError("Error al cargar datos del catálogo: " + (err.message || "Fallo de conexión."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // (handleProductoSave sin cambios)
    const handleProductoSave = () => {
        setProductoFormItem(null);
        setIsCreatingProducto(false);
        fetchData(); 
    };

    // --- 2. LÓGICA DE PRUEBA (ADMIN) Y ANULAR (JEFE) ACTUALIZADAS ---
    const handleAdminTestCreateProduct = async () => {
        setAdminLoading(true);
        try {
            // ¡Llamada real a la API!
            await productoApi.createTestProducto();
            alert('Producto de prueba (Admin) creado con éxito.');
            // Refrescamos todos los datos (productos e inventario)
            fetchData(); 
        } catch (err) {
            console.error("Error creando producto de prueba:", err);
            alert(`Error al crear producto de prueba: ${err.message}`);
        } finally {
            setAdminLoading(false);
        }
    };

    // (handleAnularProducto sin cambios)
    const handleAnularProducto = async (producto) => {
        if (window.confirm(`¿Estás seguro de ANULAR (desactivar) el producto "${producto.nombre}" con ID: ${producto.id}?`)) {
            try {
                await productoApi.deactivateProducto(producto.id);
                alert('Producto anulado (desactivado) con éxito.');
                fetchData();
            } catch (err) {
                console.error("Error al anular producto:", err);
                alert("Error al anular el producto. " + (err.message || ""));
            }
        }
    };


    // (renderInventarioTab sin cambios)
    const renderInventarioTab = () => {
        // ... (contenido de la pestaña inventario sin cambios) ...
        const filteredInventario = selectedSucursalId === 0
            ? inventario
            : inventario.filter(item => item.sucursal.id === selectedSucursalId);
        const totalStock = filteredInventario.reduce((sum, item) => sum + item.stockActual, 0);
        const totalBajoMinimo = filteredInventario.filter(i => i.stockActual < i.stockMinimo).length;
        return (
            <div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <SearchBarGenerica placeholder="Buscar por nombre de producto..." />
                    <select 
                         className={filterSelectStyles}
                        value={selectedSucursalId}
                        onChange={(e) => setSelectedSucursalId(parseInt(e.target.value))}
                    >
                        <option key={0} value={0}>Todas las Sucursales</option>
                        {sucursales.map(s => (
                            <option key={s.id} value={s.id}>{s.nombre}</option>
                        ))}
                    </select>
                </div>
                 <div className="overflow-x-auto mt-6">
                    <table className="w-full min-w-[900px] text-left">
                        <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="p-4">Producto</th>
                                <th className="p-4">Sucursal</th>
                                <th className="p-4">Stock Actual</th>
                                <th className="p-4">Stock Mínimo</th>
                                <th className="p-4">Estado de Stock</th>
                                <th className="p-4">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventario.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="p-4 font-medium">{item.producto?.nombre}</td>
                                    <td className="p-4">{item.sucursal?.nombre}</td>
                                    <td className="p-4 font-bold">{item.stockActual}</td>
                                    <td className="p-4">{item.stockMinimo}</td>
                                    <td className="p-4">
                                        <span className={`table-badge ${item.stockActual < item.stockMinimo ? 'estado-stock-low' : 'estado-stock-ok'}`}>
                                            {item.stockActual < item.stockMinimo ? 'Bajo Stock' : 'OK'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => setInventarioInfoItem(item)} title="Ver Info Secundaria">
                                            <svg className="h-6 w-6 text-gray-500 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                     </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-gray-700">
                    <p><span className="font-bold">Total de Items en Stock:</span> {totalStock}</p>
                     <p className="font-bold text-red-600">Total de Productos bajo Stock Mínimo: {totalBajoMinimo}</p>
                </div>
            </div>
        );
    };

    // --- 3. PESTAÑA MAESTRO DE PRODUCTOS ACTUALIZADA ---
    const renderMaestroTab = () => {
        const activos = productos.filter(p => p.estado).length;
        const inactivos = productos.filter(p => !p.estado).length;
        return (
            <div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    {/* --- Lógica de Botón Crear Producto por Rol --- */}
                    {userRole === 'ADMINISTRADOR' ? (
                        <button 
                            onClick={handleAdminTestCreateProduct}
                            disabled={adminLoading} // Deshabilitar si está cargando
                            className="bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold rounded-lg px-5 py-2 transition-colors shadow-lg disabled:opacity-50"
                        >
                            {adminLoading ? 'Creando...' : 'Crear Prueba Producto (Admin)'}
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsCreatingProducto(true)}
                            disabled={adminLoading}
                            className="bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold rounded-lg px-5 py-2 transition-colors shadow-lg disabled:opacity-50"
                        >
                            Crear Producto
                        </button>
                    )}
                    <SearchBarGenerica placeholder="Buscar por código o nombre..." />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left">
                        {/* (Tabla Maestro de Productos con lógica de roles en 'Acción' sin cambios) */}
                        <thead className="border-b-2 border-gray-200">
                             <tr>
                                <th className="p-4">Código</th>
                                <th className="p-4">Nombre Producto</th>
                                <th className="p-4">Talla</th>
                                <th className="p-4">Color</th>
                                <th className="p-4">Precio Ref.</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4">Acción</th>
                            </tr>
                         </thead>
                        <tbody>
                            {productos.map(p => (
                                <tr key={p.id} className="border-b border-gray-100">
                                    <td className="p-4">{p.codigo}</td>
                                    <td className="p-4 font-medium">{p.nombre}</td>
                                    <td className="p-4">{p.talla}</td>
                                    <td className="p-4">
                                        <span className={`table-badge ${getColorClass(p.color)}`}>
                                            {p.color || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-4">S/ {p.precioReferencia ? p.precioReferencia.toFixed(2) : '0.00'}</td>
                                    <td className="p-4">
                                        <span className={`table-badge ${p.estado ? 'estado-activo' : 'estado-anulado'}`}>
                                            {p.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex space-x-3">
                                        <button onClick={() => setProductoInfoItem(p)} title="Ver Info Secundaria">
                                            <svg className="h-6 w-6 text-gray-500 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                        {(userRole === 'JEFE_ALMACEN' || userRole === 'OPERADOR') && (
                                            <button onClick={() => setProductoFormItem(p)} title="Editar Producto">
                                                <svg className="h-6 w-6 text-gray-500 hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                        )}
                                        {(userRole === 'JEFE_ALMACEN' && p.estado === true) && (
                                            <button onClick={() => handleAnularProducto(p)} title="Anular (Desactivar) Producto">
                                                <svg className="h-6 w-6 text-red-400 hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                            </button>
                                        )}
                                    </td>
                                 </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-gray-700">
                    <p><span className="font-bold">Total Productos Activos:</span> {activos}</p>
                    <p><span className="font-bold">Total Productos Inactivos:</span> {inactivos}</p>
                </div>
             </div>
        );
    };

    // (renderTrackingTab sin cambios)
    const renderTrackingTab = () => {
        // ... (contenido de la pestaña tracking sin cambios) ...
        const filteredTracking = selectedTrackingEstado === 'Todos los Estados'
            ? trackingData
            : trackingData.filter(item => item.estado === selectedTrackingEstado);
        const pendientes = filteredTracking.filter(t => t.estado === 'Pendiente').length;
        const enTransito = filteredTracking.filter(t => t.estado === 'En Tránsito').length;
        const completadas = filteredTracking.filter(t => t.estado === 'Entregado').length;
        return (
            <div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <SearchBarGenerica placeholder="Buscar por Cód. Entrega o N° Salida..." />
                     <select 
                        className={filterSelectStyles}
                        value={selectedTrackingEstado}
                        onChange={(e) => setSelectedTrackingEstado(e.target.value)}
                    >
                        {ESTADOS_TRACKING_SIMULADOS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className="overflow-x-auto mt-6">
                    <table className="w-full min-w-[900px] text-left">
                        <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="p-4">Cód. Entrega</th>
                                <th className="p-4">Cód. Nota Salida</th>
                                <th className="p-4">Fecha Salida</th>
                                <th className="p-4">Destino</th>
                                <th className="p-4">Transportista</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4">Acción</th>
                            </tr>
                         </thead>
                        <tbody>
                            {filteredTracking.map(item => (
                                 <tr key={item.id} className="border-b border-gray-100">
                                    <td className="p-4 font-medium">{item.id}</td>
                                    <td className="p-4">{item.notaSalida ? `NS00${item.notaSalida.id}` : 'N/A'}</td>
                                    <td className="p-4">{formatDate(item.fechaCreacion)}</td>
                                    <td className="p-4">{item.notaSalida?.destino || 'N/A'}</td>
                                    <td className="p-4">{item.transportista}</td>
                                    <td className="p-4">
                                        <span className={`table-badge ${getTrackingStatusClass(item.estado)}`}>
                                             {item.estado}
                                        </span>
                                    </td>
                                     <td className="p-4 flex space-x-3">
                                        <button onClick={() => setTrackingInfoItem(item)} title="Ver Info Secundaria">
                                             <svg className="h-6 w-6 text-gray-500 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
                                         </button>
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-gray-700 text-sm">
                    <div>
                        <p><span className="font-bold">Entregas Pendientes:</span> {pendientes}</p>
                        <p className="font-bold text-blue-600">Entregas en Tránsito: {enTransito}</p>
                    </div>
                    <p className="font-bold text-green-600">Total Entregas Completadas: {completadas}</p>
                </div>
            </div>
        );
    };

    // (Render principal y Modales sin cambios)
    return (
        <div>
            <div className="subtab-nav">
                <div className={`subtab-item ${activeTab === TABS.INVENTARIO ? 'active' : ''}`} onClick={() => setActiveTab(TABS.INVENTARIO)}>
                    Inventario (Stock)
                </div>
                <div className={`subtab-item ${activeTab === TABS.MAESTRO ? 'active' : ''}`} onClick={() => setActiveTab(TABS.MAESTRO)}>
                    Maestro de Productos
                </div>
                <div className={`subtab-item ${activeTab === TABS.TRACKING ? 'active' : ''}`} onClick={() => setActiveTab(TABS.TRACKING)}>
                    Tracking de Entregas
                </div>
            </div>
            {loading && <p className="text-center p-8">Cargando datos...</p>}
            {error && <p className="text-center p-4 bg-red-100 text-red-700 rounded-lg">{error}</p>}
            {!loading && !error && (
                <div>
                     {activeTab === TABS.INVENTARIO && renderInventarioTab()}
                    {activeTab === TABS.MAESTRO && renderMaestroTab()}
                    {activeTab === TABS.TRACKING && renderTrackingTab()}
                </div>
            )}
            {inventarioInfoItem && (<InventarioInfoModal item={inventarioInfoItem} onClose={() => setInventarioInfoItem(null)}/>)}
            {productoInfoItem && (<ProductoInfoModal producto={productoInfoItem} onClose={() => setProductoInfoItem(null)}/>)}
            {(isCreatingProducto || productoFormItem) && (
                <ProductoFormModal
                    item={productoFormItem}
                    onClose={() => {
                         setIsCreatingProducto(false);
                        setProductoFormItem(null);
                    }}
                    onSave={handleProductoSave}
                />
            )}
            {trackingInfoItem && (<TrackingInfoModal item={trackingInfoItem} onClose={() => setTrackingInfoItem(null)}/>)}
        </div>
    );
};

export default CatalogoStockList;