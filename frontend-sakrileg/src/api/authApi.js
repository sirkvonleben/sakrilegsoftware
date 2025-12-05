import apiClient from './axiosConfig'; 

const API_URL = '/auth'; // Recuerda: sin '/api/v1' porque ya está en axiosConfig

const login = async (login, password) => {
    try {
        const response = await apiClient.post(`${API_URL}/login`, {
            login: login,
            password: password
        });

        // Verificamos que la respuesta tenga datos
        if (response.data && response.data.token) {
            // Guardamos Token
            localStorage.setItem('token', response.data.token);
            
            // Guardamos Datos del Usuario (con valores por defecto por seguridad)
            localStorage.setItem('userName', response.data.username || login); 
            localStorage.setItem('userRole', response.data.rol || 'INVITADO');      
        }

        return response.data; 
    } catch (error) {
        console.error("Error en el login:", error);
        throw error; // Deja que LoginPage maneje la alerta visual
    }
};

const logout = async () => {
    // Limpiamos todo al salir
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    // Opcional: Llamar al backend si tuvieras endpoint de logout
    return { message: "Logout exitoso" };
};

export default { login, logout };