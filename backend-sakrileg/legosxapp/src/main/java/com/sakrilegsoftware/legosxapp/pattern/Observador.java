package com.sakrilegsoftware.legosxapp.pattern;

import com.sakrilegsoftware.legosxapp.model.Inventario;

/**
 * Interfaz para el Observador (el que recibe la notificación).
 * Define el método que se invoca cuando el sujeto cambia.
 */
public interface Observador {

    // El método 'actualizar' se dispara cuando el stock cambia
    void actualizar(Inventario inventario, String mensaje);
}