package com.sakrilegsoftware.legosxapp.service;

import com.sakrilegsoftware.legosxapp.model.NotaIngreso;
import java.util.List;

public interface NotaDeIngresoService {

    /**
     * RF-04, RF-05: Registra una nueva Nota de Ingreso y actualiza el stock.
     * 
     * @param notaIngreso La nota completa, incluyendo los detalles.
     * @return La NotaIngreso guardada.
     */
    NotaIngreso registrarIngreso(NotaIngreso notaIngreso);

    /**
     * RF-09: Anula una Nota de Ingreso y revierte la operación de stock.
     * 
     * @param idNotaIngreso El ID de la nota a anular.
     */
    void anularIngreso(Long idNotaIngreso);

    /**
     * RF-10: Obtiene el historial de todos los movimientos de ingreso.
     */
    List<NotaIngreso> findAllIngresos();
}