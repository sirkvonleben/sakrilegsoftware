package com.sakrilegsoftware.legosxapp.controller;

// Importar los DTOs
import com.sakrilegsoftware.legosxapp.dto.InventarioDTO;

import com.sakrilegsoftware.legosxapp.model.Inventario;
import com.sakrilegsoftware.legosxapp.model.Producto;
import com.sakrilegsoftware.legosxapp.model.Sucursal;
import com.sakrilegsoftware.legosxapp.service.InventarioService; // Solo dependemos del servicio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventario")
public class InventarioController {

    private final InventarioService inventarioService;

    @Autowired
    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    /**
     * RF-12: Consulta de inventario en tiempo real por producto y sucursal.
     */
    @PostMapping("/consulta")
    public ResponseEntity<Inventario> obtenerStockPorProductoSucursal(@RequestBody ConsultaStockRequest request) {
        Producto p = new Producto();
        p.setId(request.getProductoId());
        Sucursal s = new Sucursal();
        s.setId(request.getSucursalId());

        return inventarioService.findInventarioByProductoSucursal(p, s)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtiene todo el inventario como una lista de DTOs.
     */
    @GetMapping
    public ResponseEntity<List<InventarioDTO>> obtenerTodoElInventario() {
        // ¡CORREGIDO! Llama al método que usa la consulta optimizada y devuelve DTOs
        List<InventarioDTO> dtoList = inventarioService.findAllInventarioDTOs();
        return ResponseEntity.ok(dtoList);
    }
}

// Clase DTO auxiliar para la solicitud de consulta
class ConsultaStockRequest {
    private Long productoId;
    private Long sucursalId;

    // Getters y Setters
    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Long getSucursalId() {
        return sucursalId;
    }

    public void setSucursalId(Long sucursalId) {
        this.sucursalId = sucursalId;
    }
}