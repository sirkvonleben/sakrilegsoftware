// frontend/src/components/modals/SuccessModal.jsx

import React from 'react';

const SuccessModal = ({ message, onClose }) => {
    return (
        // Fondo oscuro (Overlay)
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            
            {/* Contenedor del Modal */}
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4 text-center">
                
                {/* Icono de Éxito (Check) */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                
                <h2 className="text-2xl font-bold mb-4">¡Éxito!</h2>
                
                <p className="text-lg text-gray-700 mb-8">{message}</p>

                <button 
                    onClick={onClose} 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg transition-colors"
                >
                    ACEPTAR
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;