package com.sakrilegsoftware.legosxapp.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sakrilegsoftware.legosxapp.exception.ResourceNotFoundException;
import com.sakrilegsoftware.legosxapp.model.NotaSalida;
import com.sakrilegsoftware.legosxapp.model.NotaSalidaDetalle;
import com.sakrilegsoftware.legosxapp.repository.NotaSalidaRepository;
import com.sakrilegsoftware.legosxapp.repository.ProductoRepository;
import com.sakrilegsoftware.legosxapp.repository.SucursalRepository;
import com.sakrilegsoftware.legosxapp.repository.UserRepository;
import com.sakrilegsoftware.legosxapp.service.InventarioService;
import com.sakrilegsoftware.legosxapp.service.NotaDeSalidaService;
import com.sakrilegsoftware.legosxapp.service.TrackingService;
import com.sakrilegsoftware.legosxapp.service.UserService;
import com.sakrilegsoftware.legosxapp.model.TrackingEntrega;
import com.sakrilegsoftware.legosxapp.model.Producto;
import com.sakrilegsoftware.legosxapp.model.Sucursal;
import com.sakrilegsoftware.legosxapp.model.Usuario;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@Service
@Transactional
public class NotaDeSalidaServiceImpl implements NotaDeSalidaService {

    private final NotaSalidaRepository salidaRepository;
    private final InventarioService inventarioService;
    private final TrackingService trackingService;
    private final ProductoRepository productoRepository;
    private final SucursalRepository sucursalRepository;
    private final UserRepository usuarioRepository;
    private final UserService userService;

    @Autowired
    public NotaDeSalidaServiceImpl(
            NotaSalidaRepository salidaRepository,
            InventarioService inventarioService,
            TrackingService trackingService,
            ProductoRepository productoRepository,
            SucursalRepository sucursalRepository,
            UserRepository usuarioRepository,
            UserService userService) {
        this.salidaRepository = salidaRepository;
        this.inventarioService = inventarioService;
        this.trackingService = trackingService;
        this.productoRepository = productoRepository;
        this.sucursalRepository = sucursalRepository;
        this.usuarioRepository = usuarioRepository;
        this.userService = userService;
    }

    // --- (Método registrarSalida sin cambios) ---
    @Override
    public NotaSalida registrarSalida(NotaSalida notaSalida) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentLogin = authentication.getName();
        Usuario usuarioPeticion = userService.findUserByLogin(currentLogin)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado en contexto de seguridad"));

        if (usuarioPeticion.getRol().getNombre().equals("OPERADOR")) {
            Long sucursalUsuario = usuarioPeticion.getSucursal().getId();
            Long sucursalSalida = notaSalida.getSucursal().getId();
            if (!sucursalUsuario.equals(sucursalSalida)) {
                throw new IllegalArgumentException(
                        "Error de Permiso: Un OPERADOR solo puede registrar salidas de su propia sucursal.");
            }
        }

        if (notaSalida.getDetalles() == null || notaSalida.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("La nota de salida debe tener al menos un detalle de producto.");
        }

        Sucursal sucursalDB = sucursalRepository.findById(notaSalida.getSucursal().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sucursal no encontrada con ID: " + notaSalida.getSucursal().getId()));

        notaSalida.setSucursal(sucursalDB);
        notaSalida.setUsuario(usuarioPeticion);

        for (NotaSalidaDetalle detalle : notaSalida.getDetalles()) {
            Producto productoDB = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Producto no encontrado con ID: " + detalle.getProducto().getId()));
            detalle.setProducto(productoDB);

            if (!inventarioService.validarStockDisponible(
                    productoDB,
                    sucursalDB,
                    detalle.getCantidad())) {
                throw new IllegalArgumentException(
                        "Stock insuficiente para el producto: " + productoDB.getNombre());
            }
        }

        for (NotaSalidaDetalle detalle : notaSalida.getDetalles()) {
            detalle.setNotaSalida(notaSalida);
        }

        NotaSalida notaGuardada = salidaRepository.save(notaSalida);

        for (NotaSalidaDetalle detalle : notaGuardada.getDetalles()) {
            inventarioService.disminuirStock(
                    detalle.getProducto(),
                    notaGuardada.getSucursal(),
                    detalle.getCantidad());
        }

        String motivo = notaGuardada.getMotivo().toUpperCase();
        if (motivo.equals("VENTA") || motivo.equals("REPOSICION")) {
            TrackingEntrega entrega = new TrackingEntrega();
            entrega.setNotaSalida(notaGuardada);
            entrega.setEstado("Pendiente");
            entrega.setTransportista("Por Asignar");
            entrega.setObservacion("Generado automáticamente por Nota de Salida.");

            trackingService.save(entrega);
        }

        return notaGuardada;
    }

    // --- 1. MÉTODO anularSalida ACTUALIZADO CON SEGURIDAD ---
    @Override
    public void anularSalida(Long idNotaSalida) {

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

        NotaSalida nota = salidaRepository.findById(idNotaSalida)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Nota de Salida no encontrada con ID: " + idNotaSalida));

        if (!nota.getEstado().equals("ANULADO")) {
            for (NotaSalidaDetalle detalle : nota.getDetalles()) {
                inventarioService.aumentarStock(
                        detalle.getProducto(),
                        nota.getSucursal(),
                        detalle.getCantidad());
            }

            nota.setEstado("ANULADO");
            salidaRepository.save(nota);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotaSalida> findAllSalidas() {
        return salidaRepository.findAllOptimized();
    }
}