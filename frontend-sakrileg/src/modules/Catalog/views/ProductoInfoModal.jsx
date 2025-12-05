// frontend/src/modules/Catalog/views/ProductoInfoModal.jsx
import React from 'react';

// --- 1. Función 'formatDate' eliminada ---
// Ya no es necesaria, pues 'fechaCreacion' no existe en el modelo real.

const ProductoInfoModal = ({ producto, onClose }) => {
    return (
        // Fondo oscuro (Overlay)
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            
            {/* Contenedor del Modal */}
            <div 
                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4" 
                onClick={e => e.stopPropagation()}
            >
                
                <h2 className="text-2xl font-bold text-center mb-6">Info Secundaria: Producto</h2>
                
                {/* --- 2. CONTENIDO DEL MODAL ACTUALIZADO CON DATOS REALES --- */}
                <div className="space-y-4 text-lg">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">ID (Base de Datos):</span>
                        {/* Muestra el ID real del producto */}
                        <span className="font-bold">{producto.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Categoría:</span>
                        {/* Muestra la categoría real del producto */}
                        <span className="font-bold">{producto.categoria || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Stock Mínimo (RF-11):</span>
                        {/* Muestra el stock mínimo real */}
                        <span className="font-bold">{producto.stockMinimo || 0}</span>
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

export default ProductoInfoModal;