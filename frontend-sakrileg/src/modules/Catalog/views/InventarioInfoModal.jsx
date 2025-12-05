// frontend/src/modules/Catalog/views/InventarioInfoModal.jsx

import React from 'react';

// --- Funciones Helper ---
const formatProductCode = (codigo) => codigo || 'P-S/N'; // Código de producto
const formatSucursalCode = (nombre) => nombre?.substring(0, 3).toUpperCase() || 'SJM'; // Simula un código de sucursal
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const InventarioInfoModal = ({ item, onClose }) => {
    
    // Extraemos la info secundaria (basado en tu prototipo)
    const idProducto = formatProductCode(item.producto.codigo);
    const idSucursal = formatSucursalCode(item.sucursal.nombre);
    const ubicacion = item.ubicacion || 'Pasillo A, Rack 3'; // (Dato del backend)
    const fechaActualizacion = formatDate(item.fechaActualizacion); // (Dato del backend)

    return (
        // Fondo oscuro (Overlay)
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            
            {/* Contenedor del Modal */}
            <div 
                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4" 
                onClick={e => e.stopPropagation()}
            >
                
                <h2 className="text-2xl font-bold text-center mb-6">Info Secundaria: Inventario</h2>
                
                {/* Contenido Dinámico */}
                <div className="space-y-4 text-lg">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">ID Producto:</span>
                        <span className="font-bold">{idProducto}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">ID Sucursal:</span>
                        <span className="font-bold">{idSucursal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Ubicación:</span>
                        <span className="font-bold">{ubicacion}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Última Actualización:</span>
                        <span className="font-bold">{fechaActualizacion}</span>
                    </div>
                </div>

                {/* Botón Cerrar (Verde) */}
                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={onClose} 
                        className="bg-[#38a169] hover:bg-[#2f855a] text-white font-bold py-2 px-8 rounded-lg transition-colors shadow-lg"
                    >
                        CERRAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventarioInfoModal;