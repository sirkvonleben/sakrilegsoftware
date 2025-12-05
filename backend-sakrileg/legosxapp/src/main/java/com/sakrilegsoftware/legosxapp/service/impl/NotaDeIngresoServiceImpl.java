package com.sakrilegsoftware.legosxapp.service.impl;

import com.sakrilegsoftware.legosxapp.exception.ResourceNotFoundException;
import com.sakrilegsoftware.legosxapp.model.NotaIngreso;
import com.sakrilegsoftware.legosxapp.model.NotaIngresoDetalle;
import com.sakrilegsoftware.legosxapp.repository.NotaIngresoRepository;
import com.sakrilegsoftware.legosxapp.repository.ProductoRepository;
import com.sakrilegsoftware.legosxapp.repository.SucursalRepository;
import com.sakrilegsoftware.legosxapp.repository.UserRepository;
import com.sakrilegsoftware.legosxapp.model.Producto;
import com.sakrilegsoftware.legosxapp.model.Sucursal;
import com.sakrilegsoftware.legosxapp.model.Usuario;
import com.sakrilegsoftware.legosxapp.service.InventarioService;
import com.sakrilegsoftware.legosxapp.service.NotaDeIngresoService;
import com.sakrilegsoftware.legosxapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@Service
@Transactional
public class NotaDeIngresoServiceImpl implements NotaDeIngresoService {

    private final NotaIngresoRepository ingresoRepository;
    private final InventarioService inventarioService;
    private final ProductoRepository productoRepository;
    private final SucursalRepository sucursalRepository;
    private final UserRepository usuarioRepository;
    private final UserService userService;

    @Autowired
    public NotaDeIngresoServiceImpl(
            NotaIngresoRepository ingresoRepository,
            InventarioService inventarioService,
            ProductoRepository productoRepository,
            SucursalRepository sucursalRepository,
            UserRepository usuarioRepository,
            UserService userService) {
        this.ingresoRepository = ingresoRepository;
        this.inventarioService = inventarioService;
        this.productoRepository = productoRepository;
        this.sucursalRepository = sucursalRepository;
        this.usuarioRepository = usuarioRepository;
        this.userService = userService;
    }

    // --- (Método registrarIngreso sin cambios) ---
    @Override
    public NotaIngreso registrarIngreso(NotaIngreso notaIngreso) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentLogin = authentication.getName();
        Usuario usuarioPeticion = userService.findUserByLogin(currentLogin)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado en contexto de seguridad"));

        if (usuarioPeticion.getRol().getNombre().equals("OPERADOR")) {
            Long sucursalUsuario = usuarioPeticion.getSucursal().getId();
            Long sucursalIngreso = notaIngreso.getSucursal().getId();
            if (!sucursalUsuario.equals(sucursalIngreso)) {
                throw new IllegalArgumentException(
                        "Error de Permiso: Un OPERADOR solo puede registrar ingresos en su propia sucursal.");
            }
        }

        Sucursal sucursalDB = sucursalRepository.findById(notaIngreso.getSucursal().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sucursal no encontrada con ID: " + notaIngreso.getSucursal().getId()));

        notaIngreso.setSucursal(sucursalDB);
        notaIngreso.setUsuario(usuarioPeticion);

        if (notaIngreso.getDetalles() != null) {
            for (NotaIngresoDetalle detalle : notaIngreso.getDetalles()) {
                Producto productoDB = productoRepository.findById(detalle.getProducto().getId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Producto no encontrado con ID: " + detalle.getProducto().getId()));

                detalle.setProducto(productoDB);
                detalle.setNotaIngreso(notaIngreso);
            }
        }

        NotaIngreso notaGuardada = ingresoRepository.save(notaIngreso);

        for (NotaIngresoDetalle detalle : notaGuardada.getDetalles()) {
            inventarioService.aumentarStock(
                    detalle.getProducto(),
                    notaGuardada.getSucursal(),
                    detalle.getCantidad());
        }
        return notaGuardada;
    }

    // --- 1. MÉTODO anularIngreso ACTUALIZADO CON SEGURIDAD ---
    @Override
    public void anularIngreso(Long idNotaIngreso) {

        // --- INICIO DE VALIDACIÓN DE ROL ---
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentLogin = authentication.getName();
        Usuario usuarioPeticion = userService.findUserByLogin(currentLogin)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado en contexto de seguridad"));

        // Regla: Solo el JEFE_ALMACEN puede anular
        if (!usuarioPeticion.getRol().getNombre().equals("JEFE_ALMACEN")) {
            throw new IllegalArgumentException("Error de Permiso: Solo un JEFE_ALMACEN puede anular movimientos.");
        }
        // --- FIN DE VALIDACIÓN DE ROL ---

        NotaIngreso nota = ingresoRepository.findById(idNotaIngreso)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Nota de Ingreso no encontrada con ID: " + idNotaIngreso));

        if (!nota.getEstado().equals("ANULADO")) {
            for (NotaIngresoDetalle detalle : nota.getDetalles()) {
                inventarioService.disminuirStock(
                        detalle.getProducto(),
                        nota.getSucursal(),
                        detalle.getCantidad());
            }

            nota.setEstado("ANULADO");
            ingresoRepository.save(nota);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotaIngreso> findAllIngresos() {
        return ingresoRepository.findAllOptimized();
    }
}