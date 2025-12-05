package com.sakrilegsoftware.legosxapp.controller;

import com.sakrilegsoftware.legosxapp.model.NotaSalida;
import com.sakrilegsoftware.legosxapp.service.NotaDeSalidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// (Importaciones añadidas para los datos de prueba)
import com.sakrilegsoftware.legosxapp.model.Usuario;
import com.sakrilegsoftware.legosxapp.model.Sucursal;
import com.sakrilegsoftware.legosxapp.model.Producto;
import com.sakrilegsoftware.legosxapp.model.NotaSalidaDetalle;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/v1/salidas")
public class NotaSalidaController {

    private final NotaDeSalidaService notaDeSalidaService;

    @Autowired
    public NotaSalidaController(NotaDeSalidaService notaDeSalidaService) {
        this.notaDeSalidaService = notaDeSalidaService;
    }

    // --- ENDPOINT DE PRUEBA DE ADMIN (CORREGIDO) ---
    @PostMapping("/test-create")
    public ResponseEntity<NotaSalida> crearNotaSalidaDePrueba() {
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

        // --- INICIO DE LA CORRECCIÓN ---

        // 1. Crear el objeto Producto (solo con ID)
        Producto producto = new Producto();
        producto.setId(productoId);

        // 2. Crear el detalle
        NotaSalidaDetalle detalle = new NotaSalidaDetalle();

        // 3. Usar el setter público correcto
        detalle.setProducto(producto);

        // (La línea 'detalle.setId_producto(productoId);' ha sido eliminada)

        detalle.setCantidad(1); // Cantidad de prueba
        detalle.setPrecioUnitario(1.0);

        // --- FIN DE LA CORRECCIÓN ---

        // Crear la cabecera
        NotaSalida notaPrueba = new NotaSalida();
        notaPrueba.setMotivo("PRUEBA_ADMIN");
        notaPrueba.setDestino("Sistema (Admin Test)");
        notaPrueba.setUsuario(admin);
        notaPrueba.setSucursal(sucursal);

        // Asignar el detalle (importante inicializar la lista)
        notaPrueba.setDetalles(new ArrayList<>());
        notaPrueba.getDetalles().add(detalle);

        // Llamar al servicio de registro
        NotaSalida notaGuardada = notaDeSalidaService.registrarSalida(notaPrueba);
        return new ResponseEntity<>(notaGuardada, HttpStatus.CREATED);
    }

    /**
     * RF-06, RF-07, RF-08: Registra una nueva salida, valida y disminuye el stock.
     */
    @PostMapping
    public ResponseEntity<NotaSalida> crearNotaSalida(@RequestBody NotaSalida notaSalida) {
        NotaSalida notaGuardada = notaDeSalidaService.registrarSalida(notaSalida);
        return new ResponseEntity<>(notaGuardada, HttpStatus.CREATED);
    }

    /**
     * RF-10 (Parcial): Obtiene el historial de salidas.
     */
    @GetMapping
    public ResponseEntity<List<NotaSalida>> obtenerTodasLasSalidas() {
        List<NotaSalida> salidas = notaDeSalidaService.findAllSalidas();
        return ResponseEntity.ok(salidas);
    }

    /**
     * RF-09: Anula una Nota de Salida.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> anularNotaSalida(@PathVariable Long id) {
        notaDeSalidaService.anularSalida(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}