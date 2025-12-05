// frontend-sakrileg/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BACKEND_URL = 'http://localhost:8090'; // Puerto del Backend

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto del Frontend
    
    // El proxy es esencial para la comunicación CORS
    proxy: {
        // Redirige todas las llamadas que comienzan con /api
        '/api': {
            target: BACKEND_URL, 
            changeOrigin: true, // Necesario para la redirección
            secure: false, 
        }
    }
  }
});