import React from 'react';

const NotificationPanel = ({ isOpen, toggle }) => {
    return (
        <div className={`fixed inset-y-0 left-0 z-30 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            
            {/* Encabezado del Panel */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-700">Notificaciones</h3>
                <button onClick={toggle} className="text-gray-500 hover:text-red-500">
                    ✕
                </button>
            </div>

            {/* División REQ-UI-02 (Superior/Inferior) */}
            <div className="flex flex-col h-full">
                {/* Superior: Transaccionales */}
                <div className="h-1/2 p-4 border-b overflow-y-auto bg-green-50">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Actividad Reciente</h4>
                    <p className="text-sm text-gray-500 italic">Sin notificaciones nuevas.</p>
                </div>

                {/* Inferior: Negocio / Alertas */}
                <div className="h-1/2 p-4 overflow-y-auto bg-red-50">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Alertas de Stock</h4>
                    <p className="text-sm text-gray-500 italic">Todo en orden.</p>
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;