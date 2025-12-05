package com.sakrilegsoftware.legosxapp.pattern;

import com.sakrilegsoftware.legosxapp.model.Inventario;

/**
 * Interfaz para el Sujeto (el objeto observado, en este caso, el inventario).
 * Define los métodos para gestionar los observadores.
 */
public interface Sujeto {

    // Agrega un nuevo observador a la lista
    void agregar(Observador observador);

    // Elimina un observador de la lista
    void eliminar(Observador observador);

    // Notifica a todos los observadores sobre un cambio
    void notificar(Inventario inventario);
}