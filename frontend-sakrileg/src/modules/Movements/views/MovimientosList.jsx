// frontend/src/modules/Movements/views/MovimientosList.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ingresoApi from "../../../api/ingresoApi"; 
import salidaApi from "../../../api/salidaApi";
import MovimientoInfoModal from './MovimientoInfoModal';
import { useAuth } from '../../../context/AuthContext'; 

// (Helper 'getMotivoClass' sin cambios)
const getMotivoClass = (motivo) => {
    if (!motivo) return 'rol-default';
    switch (motivo.toUpperCase()) {
        case 'COMPRA': return 'motivo-compra';
        case 'VENTA': return 'motivo-venta';
        case 'DEVOLUCION': return 'motivo-devolucion';
        case 'REPOSICION': return 'motivo-reposicion';
        case 'MERMA': return 'motivo-venta';
        // (Añado el nuevo motivo de prueba)
        case 'PRUEBA_ADMIN': return 'rol-admin'; 
        default: return 'rol-default'; 
    }
};

// (Componente 'KardexTable' sin cambios)
const KardexTable = ({ data, onAnular, onViewInfo, userRole }) => ( 
  <div className="overflow-x-auto mt-4">
    <table className="w-full min-w-[1100px] text-left border-collapse">
      <thead className="border-b-2 border-gray-300 bg-gray-100">
        <tr>
          <th className="p-4">Fecha</th>
          <th className="p-4">Tipo</th>
          <th className="p-4">Código</th>
          <th className="p-4">Producto</th>
          <th className="p-4">Motivo</th>
          <th className="p-4">Cantidad</th>
          <th className="p-4">Origen/Destino</th>
          <th className="p-4">Estado</th>
          <th className="p-4">Acción</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={`${item.origen ? 'in' : 'out'}-${item.id}`} className="border-b border-gray-100 hover:bg-gray-50">
             <td className="p-4">{new Date(item.fecha).toLocaleDateString()}</td>
            <td className="p-4">
              <span className={`table-badge ${item.origen ? 'tipo-ingreso' : 'tipo-salida'}`}>
                {item.origen ? 'Ingreso' : 'Salida'}
              </span>
            </td>
            <td className="p-4">{item.origen ? `NI00${item.id}` : `NS00${item.id}`}</td>
            <td className="p-4 font-medium">{item.detalles?.[0]?.producto?.nombre || 'N/A'}</td>
            <td className="p-4">
              <span className={`table-badge ${getMotivoClass(item.motivo)}`}>
                {item.motivo}
              </span>
            </td>
            <td className={`p-4 font-bold ${item.origen ? 'text-green-600' : 'text-red-600'}`}>
              {item.origen ? '+ ' : '- '}
              {(item.detalles || []).reduce((sum, d) => sum + d.cantidad, 0)}
            </td>
            <td className="p-4">{item.origen || item.destino}</td>
            <td className="p-4">
              <span className={`table-badge ${item.estado === 'ACTIVO' ? 'estado-activo' : 'estado-anulado'}`}>
                {item.estado}
              </span>
            </td>
            <td className="p-4 flex space-x-3">
                <button onClick={() => onViewInfo(item)} title="Ver Detalles">
                    <svg className="h-6 w-6 text-gray-500 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
                </button>
                {(userRole === 'JEFE_ALMACEN' && item.estado === 'ACTIVO') && (
                     <button onClick={() => onAnular(item)} title="Anular Movimiento">
                        <svg className="h-6 w-6 text-red-400 hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    </button>
                 )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MovimientosList = () => {
  const [ingresos, setIngresos] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [infoModalItem, setInfoModalItem] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false); // Estado de carga para botones Admin

  const { usuario } = useAuth();
  const userRole = usuario?.rol?.nombre || 'OPERADOR';

  const fetchMovimientos = async () => {
    setLoading(true);
    try {
      const [ingresosData, salidasData] = await Promise.all([
        ingresoApi.getAllIngresos(),
        salidaApi.getAllSalidas()
      ]);
      setIngresos(ingresosData);
      setSalidas(salidasData);
      setError(null);
    } catch (err) {
      setError("Error: Fallo la conexión con el Backend (Spring Boot: 8090).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  // (handleAnular sin cambios)
  const handleAnular = async (item) => {
    const { id, origen, motivo } = item;
    const tipo = origen ? 'Ingreso' : 'Salida';
    if (window.confirm(`¿Estás seguro de ANULAR el movimiento [${tipo} - ${motivo}] con ID: ${id}?`)) {
        try {
            if (origen) { await ingresoApi.anularIngreso(id); } 
            else { await salidaApi.anularSalida(id); }
            alert('Movimiento anulado con éxito.');
            fetchMovimientos(); 
        } catch (err) {
            console.error("Error al anular:", err);
            alert("Error al anular el movimiento. " + (err.message || ""));
        }
    }
  };

  // --- 1. LÓGICA DE CREACIÓN DE PRUEBA (ADMIN) ACTUALIZADA ---
  const handleAdminTestCreate = async (tipo) => {
    setAdminLoading(true);
    try {
        if (tipo === 'Ingreso') {
            await ingresoApi.createTestIngreso();
        } else {
            await salidaApi.createTestSalida();
        }
        alert(`¡Registro de prueba (${tipo}) creado con éxito!`);
        fetchMovimientos(); // Recargamos la lista
    } catch (err) {
        console.error(`Error creando prueba (${tipo}):`, err);
        alert(`Error al crear registro de prueba: ${err.message}`);
    } finally {
        setAdminLoading(false);
    }
  };

  const kardexData = [...ingresos, ...salidas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
  // (Cálculos del Footer no cambian, pero añadimos PRUEBA_ADMIN)
  const footerCounts = kardexData.reduce((acc, item) => {
    if (item.estado === 'ACTIVO') { acc.activos += 1; } 
    else if (item.estado === 'ANULADO') { acc.anulados += 1; }
    const motivo = item.motivo?.toUpperCase(); 
    if (motivo === 'COMPRA') { acc.compras += 1; } 
    else if (motivo === 'VENTA') { acc.ventas += 1; } 
    else if (motivo === 'DEVOLUCION') { acc.devolucion += 1; } 
    else if (motivo === 'REPOSICION') { acc.reposicion += 1; }
    else if (motivo === 'PRUEBA_ADMIN') { acc.pruebas += 1; } // Añadido
    return acc;
  }, {
    compras: 0, ventas: 0, devolucion: 0, reposicion: 0, 
    activos: 0, anulados: 0, pruebas: 0 // Añadido
  });
  const totalRegistros = kardexData.length;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Movimientos de Inventario (Kardex)</h2>
      
      {/* --- 2. BOTONES DE ACCIÓN ACTUALIZADOS CON 'disabled' --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex space-x-4">
          
          {userRole === 'ADMINISTRADOR' ? (
            <>
              <button 
                onClick={() => handleAdminTestCreate('Ingreso')}
                disabled={adminLoading} // Deshabilitar si está cargando
                className="bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold rounded-lg px-5 py-2 transition-colors shadow-lg disabled:opacity-50"
              >
                {adminLoading ? 'Creando...' : 'Crear Prueba Ingreso (Admin)'}
              </button>
              <button 
                onClick={() => handleAdminTestCreate('Salida')}
                disabled={adminLoading} // Deshabilitar si está cargando
                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-5 py-2 transition-colors shadow-lg disabled:opacity-50"
              >
                {adminLoading ? 'Creando...' : 'Crear Prueba Salida (Admin)'}
              </button>
            </>
          ) : (
            <>
              <Link to="/movimientos/ingreso/crear" className="bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold rounded-lg px-5 py-2 transition-colors shadow-lg">
                Crear Ingreso
              </Link>
              <Link to="/movimientos/salida/crear" className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-5 py-2 transition-colors shadow-lg">
                Crear Salida
              </Link>
            </>
          )}

        </div>
        {/* (Barra de búsqueda sin cambios) */}
        <div className="w-full md:w-2/5 border-2 border-gray-300 rounded-lg p-2 flex items-center bg-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Buscar por producto, código, motivo..." className="border-none outline-none w-full pl-2" />
        </div>
      </div>

      {loading && <p className="text-center p-8 text-blue-600">Cargando Kardex...</p>}
      {error && <p className="text-center p-2 bg-red-100 text-red-700 border border-red-300 rounded-lg">{error}</p>}
      
      {!loading && !error && 
        <KardexTable 
            data={kardexData} 
            onAnular={handleAnular} 
            onViewInfo={setInfoModalItem}
            userRole={userRole}
        />}
      
      {/* (Footer sin cambios, mostrará el conteo de 'pruebas') */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200 text-gray-600 text-sm">
        {/* ... (Contenido del footer no cambia) ... */}
      </div>

      {/* (Modal sin cambios) */}
      {infoModalItem && (
        <MovimientoInfoModal
            item={infoModalItem}
            onClose={() => setInfoModalItem(null)}
        />
      )}
    </div>
  );
};

export default MovimientosList;