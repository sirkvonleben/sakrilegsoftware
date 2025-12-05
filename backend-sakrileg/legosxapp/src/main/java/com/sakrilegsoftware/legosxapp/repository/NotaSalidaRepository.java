package com.sakrilegsoftware.legosxapp.repository;

import com.sakrilegsoftware.legosxapp.model.NotaSalida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Asegúrate de importar Query
import org.springframework.stereotype.Repository;

import java.util.List; // Asegúrate de importar List

@Repository
public interface NotaSalidaRepository extends JpaRepository<NotaSalida, Long> {

    /**
     * Reemplaza a findAll() para evitar el problema N+1
     * (LazyInitializationException).
     *
     * Carga las notas de salida y trae sus relaciones (usuario, sucursal, detalles)
     * en una sola consulta.
     *
     * 'LEFT JOIN FETCH' se usa por si una nota no tuviera detalles.
     * 'DISTINCT' evita duplicados en la lista principal (cuando hay múltiples
     * detalles).
     */
    @Query("SELECT DISTINCT ns FROM NotaSalida ns " +
            "LEFT JOIN FETCH ns.usuario " +
            "LEFT JOIN FETCH ns.sucursal " +
            "LEFT JOIN FETCH ns.detalles d " +
            "LEFT JOIN FETCH d.producto")
    List<NotaSalida> findAllOptimized();

    // Dejamos que el 'findAll()' original de JpaRepository exista sin modificar
    // por si lo necesitas para otras operaciones.
    @Override
    List<NotaSalida> findAll();
}