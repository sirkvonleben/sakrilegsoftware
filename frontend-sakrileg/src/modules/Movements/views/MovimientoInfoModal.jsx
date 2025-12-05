// frontend/src/modules/Movements/views/MovimientoInfoModal.jsx

import React from 'react';

// --- Funciones Helper ---

// Formatea el ID como NI00001 o NS00001
const formatMoveCode = (item) => {
    const prefix = item.origen ? 'NI' : 'NS'; // NI = Nota Ingreso, NS = Nota Salida
    return `${prefix}${String(item.id).padStart(5, '0')}`;
};

// Formatea la fecha como DD/MM/AAAA
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// --- Componente del Modal ---

const MovimientoInfoModal = ({ item, onClose }) => {
    
    // Determinamos si es Ingreso o Salida
    const isIngreso = !!item.origen; // Si tiene 'origen', es Ingreso
    
    // Extraemos la info secundaria (basado en tu prototipo)
    const code = formatMoveCode(item);
    const observacion = item.observacion || '---'; // (Dato del backend)
    const fecha = formatDate(item.fecha); // (Dato del backend)
    
    // El precio unitario está en los detalles. 
    // Mostramos el del primer producto, como en la tabla.
    const precioUnitario = item.detalles[0]?.precioUnitario || 0;

    return (
        // Fondo oscuro (Overlay)
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            
            {/* Contenedor del Modal */}
            <div 
                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4" 
                onClick={e => e.stopPropagation()}
            >
                
                <h2 className="text-2xl font-bold text-center mb-6">Información Secundaria</h2>
                
                {/* Contenido Dinámico */}
                <div className="space-y-4 text-lg">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">{isIngreso ? 'NI code:' : 'NS code:'}</span>
                        <span className="font-bold">{code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Precio Unitario (Ref.):</span>
                        <span className="font-bold">S/ {precioUnitario.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Observación:</span>
                        <span className="font-bold">{observacion}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Fecha Movimiento:</span>
                        <span className="font-bold">{fecha}</span>
                    </div>
                </div>

                {/* Botón Cerrar (con el estilo verde que definimos) */}
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

export default MovimientoInfoModal;