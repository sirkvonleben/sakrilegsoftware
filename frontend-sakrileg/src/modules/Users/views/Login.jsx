// frontend/src/modules/Users/views/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi'; // Importamos nuestra nueva API de autenticación

// Estilos de Tailwind
const textInputStyles = "form-input w-full bg-green-50 border border-green-300 text-gray-900 rounded-lg p-3 shadow-sm focus:border-green-600 focus:ring-1 focus:ring-green-400 outline-none transition-colors duration-200";
const btnPrimaryStyles = "w-full bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold rounded-lg px-6 py-3 transition-colors shadow-lg disabled:bg-gray-400";

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setIsLoading(true);
        setError(null);

        try {
            await authApi.login(login, password);
            // ¡Éxito! Redirigir a la página principal de usuarios.
            navigate('/usuarios'); 
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Contenedor principal: Centra la caja en toda la pantalla
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            
            {/* La "Caja" del formulario de login */}
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 md:p-10 rounded-lg shadow-xl w-full max-w-md"
            >
                {/* Título */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Iniciar Sesión
                </h2>

                {/* --- MENSAJE DE ERROR --- */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center font-medium">
                        {error}
                    </div>
                )}

                {/* --- CAMPO DE USUARIO (LOGIN) --- */}
                <div className="mb-4">
                    <label 
                        htmlFor="login" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Usuario (Login)
                    </label>
                    <input
                        type="text"
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className={textInputStyles}
                        placeholder="Ej: jadmin"
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* --- CAMPO DE CONTRASEÑA --- */}
                <div className="mb-8">
                    <label 
                        htmlFor="password" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={textInputStyles}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* --- BOTÓN DE INICIO DE SESIÓN --- */}
                <button 
                    type="submit" 
                    className={btnPrimaryStyles} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </button>

            </form>
        </div>
    );
};

export default Login;