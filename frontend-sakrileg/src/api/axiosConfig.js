import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api/v1', // Usa el proxy
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el Token JWT a cada petición
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirigir si el token expira
        }
        return Promise.reject(error);
    }
);

export default apiClient;