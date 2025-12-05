// frontend/src/modules/Catalog/views/ProductoFormModal.jsx
import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import productoApi from '../../../api/productoApi';

// --- Constantes para los Dropdowns ---
const TALLAS_DISPONIBLES = ['S', 'M', 'L', 'XL', 'N/A'];
const COLORES_DISPONIBLES = [
    { nombre: 'Rojo', hex: '#E53E3E' },
    { nombre: 'Azul', hex: '#3182CE' },
    { nombre: 'Blanco', hex: '#FFFFFF' },
    { nombre: 'Negro', hex: '#1A202C' },
    { nombre: 'Verde', hex: '#38A169' },
    { nombre: 'Gris', hex: '#A0AEC0' },
];

// --- Estilos de Inputs (Verde claro) ---
const inputStyles = "form-input w-full bg-green-50 border border-green-300 text-gray-900 rounded-lg p-3 shadow-sm focus:border-green-600 focus:ring-1 focus:ring-green-400 outline-none transition-colors duration-200";
const selectStyles = "form-select w-full bg-green-50 border border-green-300 text-gray-900 rounded-lg p-3 shadow-sm focus:border-green-600 focus:ring-1 focus:ring-green-400 outline-none transition-colors duration-200";
const disabledInputStyles = "form-input w-full bg-gray-200 border border-gray-300 text-gray-500 rounded-lg p-3 shadow-sm cursor-not-allowed";

const ProductoFormModal = ({ item, onClose, onSave }) => {
    
    const { addNotification } = useNotification(); // <-- Usar Hook
    const mode = item ? 'editar' : 'crear';
    const title = mode === 'crear' ? 'Crear Nuevo Producto' : 'EDITAR producto';

    // --- 1. ESTADO INICIAL ACTUALIZADO ---
    // 'descripcion' fue eliminado
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        talla: 'M',
        color: 'Negro',
        precioReferencia: 0.0,
        stockMinimo: 10,
        estado: 'true',
        categoria: 'POLO', // Mantenemos el default, pero ahora hay un input
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- 2. USEEFFECT ACTUALIZADO ---
    // 'descripcion' fue eliminado
    useEffect(() => {
        if (item) {
            setFormData({
                codigo: item.codigo || '',
                nombre: item.nombre || '',
                talla: item.talla || 'M',
                color: item.color || 'Negro',
                precioReferencia: item.precioReferencia || 0.0,
                stockMinimo: item.stockMinimo || 10,
                estado: item.estado ? 'true' : 'false',
                categoria: item.categoria || 'POLO',
             });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- 3. HANDLESUBMIT ACTUALIZADO ---
    // 'descripcion' ya no se envía
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const dataParaApi = {
            ...formData,
            estado: formData.estado === 'true',
            precioReferencia: parseFloat(formData.precioReferencia),
            stockMinimo: parseInt(formData.stockMinimo),
        };
        
        try {
            if (mode === 'crear') {
                await productoApi.createProducto(dataParaApi);
                addNotification(`Producto creado: ${formData.nombre}`, 'SUCCESS');
            } else {
                await productoApi.updateProducto(item.id, dataParaApi);
                addNotification(`Producto actualizado: ${formData.nombre}`, 'INFO');
            }
            onSave();
        } catch (err) {
            addNotification(`Error al guardar: ${err.message}`, 'ALERT'); // También para errores
            console.error("Error al guardar producto:", err);
            setError(err.message || "Error al guardar. Verifique los datos.");
        } finally {
            setLoading(false);
        }
    };

    const getSelectedColorHex = () => {
        const selected = COLORES_DISPONIBLES.find(c => c.nombre === formData.color);
        return selected ? selected.hex : '#1A202C';
    };

    return (
        // Fondo oscuro (Overlay)
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            
            {/* Contenedor del Modal */}
            <div 
                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg mx-4" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-[#dd6b20] hover:bg-[#fef3c7] hover:text-[#c05621] font-semibold p-2 rounded-md transition-colors"
                    >
                        REGRESAR
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* --- 4. JSX ACTUALIZADO --- */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código Producto</label>
                            <input 
                                type="text" 
                                name="codigo" 
                                value={formData.codigo} 
                                onChange={handleChange} 
                                required 
                                disabled={mode === 'editar'} // Deshabilitado si es 'editar'
                                className={mode === 'editar' ? disabledInputStyles : inputStyles} 
                                placeholder="Ej: P003" 
                            />
                        </div>
                        {/* --- CAMPO CATEGORÍA AÑADIDO --- */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría (RF-11)</label>
                            <input 
                                type="text" 
                                name="categoria" 
                                value={formData.categoria} 
                                onChange={handleChange} 
                                required 
                                className={inputStyles} 
                                placeholder="Ej: POLO / T-SHIRT" 
                            />
                        </div>
                    </div>
                    
                    {/* Campo Nombre ahora ocupa toda la fila */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Producto</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className={inputStyles} placeholder="Ej: Polo Clásico Manga Corta" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Talla</label>
                            <select name="talla" value={formData.talla} onChange={handleChange} className={selectStyles}>
                                {TALLAS_DISPONIBLES.map(talla => (
                                     <option key={talla} value={talla}>{talla}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <select 
                                name="color" 
                                value={formData.color} 
                                onChange={handleChange} 
                                className={selectStyles}
                                style={{ color: getSelectedColorHex(), fontWeight: 'bold' }}
                            >
                                {COLORES_DISPONIBLES.map(color => (
                                    <option key={color.nombre} value={color.nombre} style={{ color: color.hex, fontWeight: 'bold' }}>
                                        {color.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Ref. (S/)</label>
                            <input type="number" name="precioReferencia" value={formData.precioReferencia} onChange={handleChange} required step="0.01" className={inputStyles} />
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                            <input type="number" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} required className={inputStyles} />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                             <select name="estado" value={formData.estado} onChange={handleChange} required className={selectStyles}>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                             </select>
                        </div>
                    </div>
                    
                    {/* Botón Guardar */}
                     <div className="flex justify-end pt-4">
                        <button type="submit" disabled={loading} className="bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold rounded-lg px-6 py-2 transition-colors shadow-lg">
                            {loading ? 'Guardando...' : 'GUARDAR PRODUCTO'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductoFormModal;