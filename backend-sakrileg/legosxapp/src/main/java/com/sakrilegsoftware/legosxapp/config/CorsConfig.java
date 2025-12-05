package com.sakrilegsoftware.legosxapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración CORS: Permite al frontend (localhost:5173) acceder a la API
 * (localhost:8090).
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Habilitar CORS para todos los endpoints bajo /api/v1/
        registry.addMapping("/api/v1/**")
                // Permitir peticiones desde el origen de nuestro frontend de desarrollo
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}