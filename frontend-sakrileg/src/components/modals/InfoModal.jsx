// frontend/src/components/modals/InfoModal.jsx

import React from 'react';

// Formatea el ID de usuario
const formatUserCode = (id) => {
    return `USER${String(id).padStart(5, '0')}`;
};

const InfoModal = ({ user, onClose }) => {
    
    // Extraemos la info secundaria que no está en la tabla
    const code = formatUserCode(user.id);
    const login = user.login || '---';
    const correo = user.correo || '---';
    const sucursal = user.sucursal?.nombre || 'No asignada';

    return (
        // Fondo oscuro (Overlay)
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            
            {/* Contenedor del Modal */}
            <div 
                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4" 
                onClick={e => e.stopPropagation()} // Evita que el clic en el modal cierre el overlay
            >
                
                <h2 className="text-2xl font-bold text-center mb-6">Información Secundaria del Usuario</h2>
                
                {/* Contenido Dinámico */}
                <div className="space-y-4 text-lg">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Código:</span>
                        <span className="font-bold">{code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Login (Username):</span>
                        <span className="font-bold">{login}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Correo:</span>
                        <span className="font-bold">{correo}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Sucursal Asignada:</span>
                        <span className="font-bold">{sucursal}</span>
                    </div>
                </div>

                {/* Botón Cerrar (estilo verde) */}
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

export default InfoModal;