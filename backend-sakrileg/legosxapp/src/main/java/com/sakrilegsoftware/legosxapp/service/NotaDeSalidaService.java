
package com.sakrilegsoftware.legosxapp.service;

import com.sakrilegsoftware.legosxapp.model.NotaSalida;
import java.util.List;

public interface NotaDeSalidaService {

    /**
     * RF-06, RF-07, RF-08: Registra una nueva Nota de Salida, valida el stock y lo
     * disminuye.
     * * @param notaSalida La nota completa, incluyendo los detalles.
     * 
     * @return La NotaSalida guardada.
     */
    NotaSalida registrarSalida(NotaSalida notaSalida);

    /**
     * RF-09: Anula una Nota de Salida y revierte la operación de stock (aumenta el
     * stock).
     * * @param idNotaSalida El ID de la nota a anular.
     */
    void anularSalida(Long idNotaSalida);

    /**
     * RF-10: Obtiene el historial de todos los movimientos de salida.
     */
    List<NotaSalida> findAllSalidas();
}
