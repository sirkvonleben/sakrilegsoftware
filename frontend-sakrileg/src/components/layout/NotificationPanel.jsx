import React from 'react';
// Importamos el hook y la función formatTime del contexto
import { useNotification } from '../../context/NotificationContext'; 

const NotificationPanel = ({ isOpen, toggle }) => {
    // --- EXTRAEMOS formatTime AQUÍ ---
    const { notifications, clearNotifications, formatTime } = useNotification();

    // Filtramos tipos para las secciones
    const alertas = notifications.filter(n => n.tipo === 'ALERT');
    const actividades = notifications.filter(n => n.tipo !== 'ALERT');

    return (
        <>
            {/* Overlay para cerrar al hacer clic fuera */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-20 z-30" onClick={toggle}></div>
            )}

            <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Encabezado */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-700">Notificaciones ({notifications.length})</h3>
                    <div className="flex gap-2">
                        {notifications.length > 0 && (
                            <button onClick={clearNotifications} className="text-xs text-blue-500 hover:underline">Limpiar</button>
                        )}
                        <button onClick={toggle} className="text-gray-500 hover:text-red-500 font-bold px-2">✕</button>
                    </div>
                </div>

                <div className="flex flex-col h-full overflow-hidden">
                    
                    {/* 1. SECCIÓN SUPERIOR: Actividad Reciente */}
                    <div className="h-1/2 p-4 border-b overflow-y-auto bg-green-50/30">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Actividad Reciente</h4>
                        
                        {actividades.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Sin actividad reciente.</p>
                        ) : (
                            <ul className="space-y-3">
                                {actividades.map((notif) => (
                                    <li key={notif.id} className="bg-white p-3 rounded border border-green-100 shadow-sm text-sm transition-all hover:shadow-md">
                                        <p className="text-gray-800">{notif.mensaje}</p>
                                        <p className="text-[10px] text-gray-400 text-right mt-1 font-mono">
                                            {/* --- CORRECCIÓN AQUÍ: Usamos formatTime --- */}
                                            {formatTime(notif.fecha)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 2. SECCIÓN INFERIOR: Alertas de Sistema */}
                    <div className="h-1/2 p-4 overflow-y-auto bg-red-50/30 pb-20">
                        <h4 className="text-xs font-bold text-red-400 uppercase mb-3">Alertas de Sistema</h4>
                        
                        {alertas.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Todo en orden.</p>
                        ) : (
                            <ul className="space-y-3">
                                {alertas.map((notif) => (
                                    <li key={notif.id} className="bg-white p-3 rounded-l-md border-l-4 border-red-500 shadow-sm text-sm transition-all hover:bg-red-50">
                                        <p className="text-red-700 font-medium">{notif.mensaje}</p>
                                        <p className="text-[10px] text-gray-400 text-right mt-1 font-mono">
                                            {/* --- CORRECCIÓN AQUÍ: Usamos formatTime --- */}
                                            {formatTime(notif.fecha)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;