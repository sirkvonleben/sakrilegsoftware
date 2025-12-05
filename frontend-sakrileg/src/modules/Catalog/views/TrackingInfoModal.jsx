// frontend/src/modules/Catalog/views/TrackingInfoModal.jsx
import React from 'react';

// --- 1. FUNCIÓN SIMULADA 'getTrackingDetails' ELIMINADA ---

const TrackingInfoModal = ({ item, onClose }) => {
    
    // --- 2. Constante 'details' eliminada, usaremos 'item' directamente ---

    return (
        // Fondo oscuro (Overlay)
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            
            {/* Contenedor del Modal */}
            <div 
                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4" 
                 onClick={e => e.stopPropagation()}
            >
                
                <h2 className="text-2xl font-bold text-center mb-6">Info Secundaria: Entrega</h2>
                
                {/* Contenido Dinámico (Ahora con datos reales) */}
                <div className="space-y-4 text-lg">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Observaciones:</span>
                        {/* --- 3. MOSTRANDO DATO REAL DEL API --- */}
                        <span className="font-bold">{item.observacion || 'Sin observaciones'}</span>
                     </div>
                    
                    {/* --- 4. CAMPOS SIMULADOS 'Producto' y 'Cantidad' ELIMINADOS --- */}
                    {/* Estos campos no existen en el objeto TrackingEntrega */}

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

export default TrackingInfoModal;