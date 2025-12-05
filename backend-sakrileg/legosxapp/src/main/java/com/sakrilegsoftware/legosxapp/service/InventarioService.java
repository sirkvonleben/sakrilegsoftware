package com.sakrilegsoftware.legosxapp.service;

import java.util.List; // Importar List
import java.util.Optional;

import com.sakrilegsoftware.legosxapp.model.Inventario;
import com.sakrilegsoftware.legosxapp.model.Producto;
import com.sakrilegsoftware.legosxapp.model.Sucursal;
import com.sakrilegsoftware.legosxapp.dto.InventarioDTO; // Importar el DTO

// Contrato para la gestión de stock en tiempo real (RF-12, RNF-01)
public interface InventarioService {

    /** RF-05: Aumenta el stock en una sucursal tras una Nota de Ingreso. */
    Inventario aumentarStock(Producto producto, Sucursal sucursal, int cantidad);

    /** RF-07: Disminuye el stock en una sucursal tras una Nota de Salida. */
    Inventario disminuirStock(Producto producto, Sucursal sucursal, int cantidad);

    /** RF-08: Valida que haya suficiente stock antes de una Nota de Salida. */
    boolean validarStockDisponible(Producto producto, Sucursal sucursal, int cantidad);

    /** RF-12: Consulta el stock actual por producto y sucursal. */
    Optional<Inventario> findInventarioByProductoSucursal(Producto producto, Sucursal sucursal);

    // --- ¡NUEVO MÉTODO! ---
    /**
     * Obtiene todo el inventario pero transformado en DTOs para evitar
     * problemas de serialización (Lazy Loading) y exponer solo datos necesarios.
     * 
     * @return Lista de InventarioDTO
     */
    List<InventarioDTO> findAllInventarioDTOs();
}