// frontend/src/modules/Auth/views/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// --- 1. IMPORTAR EL HOOK 'useAuth' ---
import { useAuth } from '../../../context/AuthContext'; 
// --- 'authApi' ya no se importa aquí ---

// (Este es un componente de UI básico, puedes mejorarlo con tus estilos)
const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // --- 2. OBTENER LA FUNCIÓN 'login' DEL CONTEXTO ---
    const { login: authLogin } = useAuth(); // Renombramos 'login' a 'authLogin' para evitar colisión de nombres

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // --- 3. LLAMAR A LA FUNCIÓN DEL CONTEXTO ---
            // Esta función (authLogin) ahora hace todo:
            // 1. Llama a la API
            // 2. Guarda el usuario en el estado global
            // 3. Guarda el usuario en localStorage
            await authLogin(login, password);

            // ¡Éxito! Redirige al dashboard (Gestión de Usuarios)
            navigate('/usuarios');
        
        } catch (err) {
            // El error (ej: "Credenciales inválidas") vendrá desde el AuthContext
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-amber-50">
            <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usuario Login
                        </label>
                         <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                            className="form-input w-full bg-green-50 border border-green-300 rounded-lg p-3 shadow-sm"
                        />
                     </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input w-full bg-green-50 border border-green-300 rounded-lg p-3 shadow-sm"
                         />
                    </div>
                    <div>
                        <button
                             type="submit"
                            disabled={loading}
                            className="w-full bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold rounded-lg px-6 py-3 transition-colors shadow-lg disabled:opacity-50"
                        >
                             {loading ? 'Ingresando...' : 'INGRESAR'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;