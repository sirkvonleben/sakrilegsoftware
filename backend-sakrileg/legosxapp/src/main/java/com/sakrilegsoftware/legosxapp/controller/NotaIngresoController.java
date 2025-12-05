package com.sakrilegsoftware.legosxapp.controller;

import com.sakrilegsoftware.legosxapp.model.NotaIngreso;
import com.sakrilegsoftware.legosxapp.service.NotaDeIngresoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// --- 1. IMPORTACIONES AÑADIDAS PARA LOS DATOS DE PRUEBA ---
import com.sakrilegsoftware.legosxapp.model.Usuario;
import com.sakrilegsoftware.legosxapp.model.Sucursal;
import com.sakrilegsoftware.legosxapp.model.Producto;
import com.sakrilegsoftware.legosxapp.model.NotaIngresoDetalle;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/v1/ingresos") // Endpoint para Notas de Ingreso
public class NotaIngresoController {

    private final NotaDeIngresoService notaDeIngresoService;

    @Autowired
    public NotaIngresoController(NotaDeIngresoService notaDeIngresoService) {
        this.notaDeIngresoService = notaDeIngresoService;
    }

    // --- 2. NUEVO ENDPOINT PARA ADMIN ---
    @PostMapping("/test-create")
    public ResponseEntity<NotaIngreso> crearNotaIngresoDePrueba() {
        // Asumimos que el ID 1 existe para todos (según data.sql)
        long adminUserId = 1L;
        long sucursalId = 1L;
        long productoId = 1L;

        // Crear el objeto Usuario (solo con ID es suficiente)
        Usuario admin = new Usuario();
        admin.setId(adminUserId);

        // Crear el objeto Sucursal (solo con ID)
        Sucursal sucursal = new Sucursal();
        sucursal.setId(sucursalId);

        // Crear el objeto Producto (solo con ID)
        Producto producto = new Producto();
        producto.setId(productoId);

        // Crear el detalle
        NotaIngresoDetalle detalle = new NotaIngresoDetalle();
        detalle.setProducto(producto);
        detalle.setCantidad(1); // Cantidad de prueba
        detalle.setPrecioUnitario(1.0);

        // Crear la cabecera
        NotaIngreso notaPrueba = new NotaIngreso();
        notaPrueba.setMotivo("PRUEBA_ADMIN");
        notaPrueba.setOrigen("Sistema (Admin Test)");
        notaPrueba.setUsuario(admin);
        notaPrueba.setSucursal(sucursal);

        // Asignar el detalle (importante inicializar la lista)
        notaPrueba.setDetalles(new ArrayList<>());
        notaPrueba.getDetalles().add(detalle);

        // Llamar al servicio de registro
        NotaIngreso notaGuardada = notaDeIngresoService.registrarIngreso(notaPrueba);
        return new ResponseEntity<>(notaGuardada, HttpStatus.CREATED);
    }
    // --- FIN DEL NUEVO ENDPOINT ---

    /**
     * RF-04, RF-05: Registra un nuevo ingreso y actualiza el stock.
     */
    @PostMapping
    public ResponseEntity<NotaIngreso> crearNotaIngreso(@RequestBody NotaIngreso notaIngreso) {
        NotaIngreso notaGuardada = notaDeIngresoService.registrarIngreso(notaIngreso);
        return new ResponseEntity<>(notaGuardada, HttpStatus.CREATED);
    }

    /**
     * RF-10 (Parcial): Obtiene el historial de ingresos.
     */
    @GetMapping
    public ResponseEntity<List<NotaIngreso>> obtenerTodosLosIngresos() {
        List<NotaIngreso> ingresos = notaDeIngresoService.findAllIngresos();
        return ResponseEntity.ok(ingresos);
    }

    /**
     * RF-09: Anula una Nota de Ingreso.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> anularNotaIngreso(@PathVariable Long id) {
        notaDeIngresoService.anularIngreso(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}