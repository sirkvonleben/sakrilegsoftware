package com.sakrilegsoftware.legosxapp.repository;

import com.sakrilegsoftware.legosxapp.model.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Hereda todos los métodos CRUD para la entidad Sucursal.
@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Long> {

    // Spring Data JPA generará automáticamente esta consulta:
    boolean existsByNombre(String nombre);
}