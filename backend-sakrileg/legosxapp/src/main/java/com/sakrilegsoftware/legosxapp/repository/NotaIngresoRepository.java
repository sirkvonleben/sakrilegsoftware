package com.sakrilegsoftware.legosxapp.repository;

import com.sakrilegsoftware.legosxapp.model.NotaIngreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface NotaIngresoRepository extends JpaRepository<NotaIngreso, Long> {

    // Spring Data JPA generará automáticamente los métodos de búsqueda.
    // Por ejemplo, para el historial (RF-10), podríamos añadir:
    // List<NotaIngreso> findByFechaBetween(LocalDateTime inicio, LocalDateTime
    // fin);

    @Query("SELECT DISTINCT ni FROM NotaIngreso ni " +
            "LEFT JOIN FETCH ni.usuario " +
            "LEFT JOIN FETCH ni.sucursal " +
            "LEFT JOIN FETCH ni.detalles d " +
            "LEFT JOIN FETCH d.producto")
    List<NotaIngreso> findAllOptimized();
}