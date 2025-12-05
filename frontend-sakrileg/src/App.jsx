import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTS DE CONTEXTO (¡ESTO ES LO QUE FALTA!) ---
import { AuthProvider } from './context/AuthContext'; 
import { NotificationProvider } from './context/NotificationContext';

// --- IMPORTS DE VISTAS ---
import Layout from './components/layout/Layout';
import LoginPage from './modules/Auth/views/LoginPage';

// Usuarios
import UserList from './modules/Users/views/UserList'; 
import UserForm from './modules/Users/views/UserForm'; 

// Movimientos
import MovimientosList from './modules/Movements/views/MovimientosList';
import IngresoForm from './modules/Movements/views/IngresoForm';
import SalidaForm from './modules/Movements/views/SalidaForm';

// Catálogo
import CatalogoStockList from './modules/Catalog/views/CatalogoStockList';

// (En un futuro, aquí crearíamos un componente <ProtectedRoute>)

function App() {
    return (
        <Router>
            {/* 1. Proveedor de Autenticación (Usuario, Login, Logout) */}
            <AuthProvider>
                
                {/* 2. Proveedor de Notificaciones (Alertas laterales) */}
                <NotificationProvider> 
                    
                    <Routes>
                        {/* Ruta Pública: Login */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Rutas Protegidas (Con Layout) */}
                        <Route path="/" element={<Layout />}>
                            
                            {/* Redirección inicial */}
                            <Route index element={<Navigate to="/usuarios" replace />} />

                            {/* Gestión de Usuarios */}
                            <Route path="/usuarios" element={<UserList />} />
                            <Route path="/usuarios/crear" element={<UserForm mode="crear" />} />
                            <Route path="/usuarios/editar/:id" element={<UserForm mode="editar" />} />
                            
                            {/* Movimientos */}
                            <Route path="/movimientos" element={<MovimientosList />} />
                            <Route path="/movimientos/ingreso/crear" element={<IngresoForm mode="crear" />} />
                            <Route path="/movimientos/salida/crear" element={<SalidaForm mode="crear" />} />

                            {/* Catálogo */}
                            <Route path="/catalogo" element={<CatalogoStockList />} />
                            
                            {/* Ruta 404 - Redirige al inicio */}
                            <Route path="*" element={<Navigate to="/usuarios" replace />} />
                        </Route>
                    </Routes>

                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;