package com.sakrilegsoftware.legosxapp.controller;

import com.sakrilegsoftware.legosxapp.model.Producto;
import com.sakrilegsoftware.legosxapp.service.ProductoService;
import com.sakrilegsoftware.legosxapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    private final ProductoService productoService;

    @Autowired
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // --- 2. NUEVO ENDPOINT PARA ADMIN ---
    @PostMapping("/test-create")
    public ResponseEntity<Producto> crearProductoDePrueba() {
        // Genera un código único para evitar colisiones
        String codigoUnico = "TEST-" + UUID.randomUUID().toString().substring(0, 8);

        Producto productoPrueba = new Producto();
        productoPrueba.setNombre("Producto de Prueba (Admin)");
        productoPrueba.setCodigo(codigoUnico);
        productoPrueba.setCategoria("PRUEBA");
        productoPrueba.setTalla("M");
        productoPrueba.setColor("Gris");
        productoPrueba.setPrecioReferencia(1.0);
        productoPrueba.setStockMinimo(1);
        productoPrueba.setEstado(true);

        // Llama al mismo servicio 'saveProducto'
        // (Este servicio ya crea el inventario en stock 0 para todas las sucursales)
        Producto nuevoProducto = productoService.saveProducto(productoPrueba);

        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }
    // --- FIN DEL NUEVO ENDPOINT ---

    // RF-11: Crea o actualiza un producto (Usado por Jefe y Operador)
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.saveProducto(producto);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }

    // RF-11: Obtiene la lista completa de productos
    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodosLosProductos() {
        List<Producto> productos = productoService.findAllProductos();
        return ResponseEntity.ok(productos);
    }

    // RF-11: Obtener un producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        return productoService.findProductoById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
    }

    // RF-11: Desactivar (anular) un producto (Usado por Jefe de Almacén)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarProducto(@PathVariable Long id) {
        try {
            productoService.deactivateProducto(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            throw e;
        }
    }

    // RF-11: Actualizar un producto (Usado por Jefe y Operador)
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        try {
            Producto productoActualizado = productoService.updateProducto(id, productoDetails);
            return ResponseEntity.ok(productoActualizado);
        } catch (ResourceNotFoundException e) {
            throw e; // Deja que Spring maneje la excepción 404
        }
    }
}