package com.sakrilegsoftware.legosxapp.repository;

import com.sakrilegsoftware.legosxapp.model.Inventario;
import com.sakrilegsoftware.legosxapp.model.Producto;
import com.sakrilegsoftware.legosxapp.model.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    /**
     * RF-12: Consulta el stock por producto y sucursal.
     */
    Optional<Inventario> findByProductoAndSucursal(Producto producto, Sucursal sucursal);

    /**
     * Consulta OPTIMIZADA:
     * Carga el inventario CON sus productos y sucursales (evita error 500).
     */
    @Query("SELECT DISTINCT i FROM Inventario i " +
            "LEFT JOIN FETCH i.producto " +
            "LEFT JOIN FETCH i.sucursal")
    List<Inventario> findAllOptimized();

}