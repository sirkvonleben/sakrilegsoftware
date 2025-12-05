import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// --- ¡NUEVA VISTA DE LOGIN! ---
import LoginPage from './modules/Auth/views/LoginPage';

// Vistas de Usuarios
import UserList from './modules/Users/views/UserList'; 
import UserForm from './modules/Users/views/UserForm'; 

// Vistas de Movimientos
import MovimientosList from './modules/Movements/views/MovimientosList'; 
import IngresoForm from './modules/Movements/views/IngresoForm';
import SalidaForm from './modules/Movements/views/SalidaForm';

// Vistas de Catálogo
import CatalogoStockList from './modules/Catalog/views/CatalogoStockList'; 

// (En un futuro, aquí crearíamos un componente <ProtectedRoute>)

function App() {
    return (
        <Router>
            <Routes>
                {/* --- ¡NUEVA RUTA DE LOGIN! --- */}
                {/* Esta ruta NO usa el Layout (no tiene la barra de navegación verde) */}
                <Route path="/login" element={<LoginPage />} />

                {/* --- RUTAS PROTEGIDAS (Usan el Layout) --- */}
                <Route path="/" element={<Layout />}>
                    
                    {/* Ruta Base: Redirige a login o a usuarios */}
                    <Route index element={<Navigate to="/usuarios" replace />} />

                    {/* Rutas de Módulos */}
                    <Route path="/usuarios" element={<UserList />} />
                    <Route path="/usuarios/crear" element={<UserForm mode="crear" />} />
                    <Route path="/usuarios/editar/:id" element={<UserForm mode="editar" />} />
                    
                    <Route path="/movimientos" element={<MovimientosList />} />
                    <Route path="/movimientos/ingreso/crear" element={<IngresoForm mode="crear" />} />
                    <Route path="/movimientos/salida/crear" element={<SalidaForm mode="crear" />} />

                    <Route path="/catalogo" element={<CatalogoStockList />} />
                    {/* (Aquí faltarían las rutas de /catalogo/producto/crear si las mantenemos) */}
                    
                    {/* Redirección por defecto si la ruta no existe */}
                    <Route path="*" element={<Navigate to="/usuarios" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;