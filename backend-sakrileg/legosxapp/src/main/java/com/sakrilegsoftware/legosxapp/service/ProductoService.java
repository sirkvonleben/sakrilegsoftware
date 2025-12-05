package com.sakrilegsoftware.legosxapp.service;

import com.sakrilegsoftware.legosxapp.model.Producto;
import java.util.List;
import java.util.Optional;

// Contrato para la gestión de productos (Maestro de Productos - RF-11)
public interface ProductoService {

    /** RF-11: Registra o actualiza un producto. */
    Producto saveProducto(Producto producto);

    /** RF-11: Obtiene la lista completa de productos (para Catálogo). */
    List<Producto> findAllProductos();

    /** RF-11: Busca un producto por su ID. */
    Optional<Producto> findProductoById(Long id);

    /** RF-11: Desactiva (anula) un producto (no lo borra físicamente). */
    void deactivateProducto(Long id);

    Producto updateProducto(Long id, Producto productoDetails);
    // Aquí irían métodos para búsquedas específicas por código, categoría, etc.
}