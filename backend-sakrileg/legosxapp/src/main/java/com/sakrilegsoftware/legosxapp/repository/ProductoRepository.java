package com.sakrilegsoftware.legosxapp.repository;

import com.sakrilegsoftware.legosxapp.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Spring Data JPA generará automáticamente esta consulta para la validación:
    boolean existsByCodigo(String codigo);

    // No se necesita ninguna @Query, el método findAll() por defecto es suficiente.
}