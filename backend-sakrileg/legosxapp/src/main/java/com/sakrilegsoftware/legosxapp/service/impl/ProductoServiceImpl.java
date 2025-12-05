package com.sakrilegsoftware.legosxapp.service.impl;

import com.sakrilegsoftware.legosxapp.exception.ResourceNotFoundException;
import com.sakrilegsoftware.legosxapp.model.Producto;
import com.sakrilegsoftware.legosxapp.model.Sucursal;
import com.sakrilegsoftware.legosxapp.model.Usuario; // <-- 1. IMPORTAR USUARIO
import com.sakrilegsoftware.legosxapp.repository.ProductoRepository;
import com.sakrilegsoftware.legosxapp.repository.SucursalRepository;
import com.sakrilegsoftware.legosxapp.service.InventarioService;
import com.sakrilegsoftware.legosxapp.service.ProductoService;
import com.sakrilegsoftware.legosxapp.service.UserService; // <-- 2. IMPORTAR USER SERVICE
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

// --- 3. IMPORTAR CLASES DE SEGURIDAD ---
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@Service
@Transactional
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final SucursalRepository sucursalRepository;
    private final InventarioService inventarioService;
    private final UserService userService; // <-- 4. INYECTAR USER SERVICE

    @Autowired
    public ProductoServiceImpl(
            ProductoRepository productoRepository,
            SucursalRepository sucursalRepository,
            InventarioService inventarioService,
            UserService userService // <-- 5. AÑADIR AL CONSTRUCTOR
    ) {
        this.productoRepository = productoRepository;
        this.sucursalRepository = sucursalRepository;
        this.inventarioService = inventarioService;
        this.userService = userService; // <-- 6. ASIGNAR
    }

    // (Método saveProducto sin cambios)
    @Override
    public Producto saveProducto(Producto producto) {
        boolean isNewProduct = (producto.getId() == null);
        if (isNewProduct && productoRepository.existsByCodigo(producto.getCodigo())) {
            throw new IllegalArgumentException("El código de producto ya existe.");
        }
        Producto productoGuardado = productoRepository.save(producto);
        if (isNewProduct) {
            List<Sucursal> sucursales = sucursalRepository.findAll();
            for (Sucursal sucursal : sucursales) {
                inventarioService.aumentarStock(productoGuardado, sucursal, 0);
            }
        }
        return productoGuardado;
    }

    // (Método updateProducto sin cambios)
    @Override
    public Producto updateProducto(Long id, Producto productoDetails) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        productoExistente.setCodigo(productoDetails.getCodigo());
        productoExistente.setNombre(productoDetails.getNombre());
        productoExistente.setCategoria(productoDetails.getCategoria());
        productoExistente.setTalla(productoDetails.getTalla());
        productoExistente.setColor(productoDetails.getColor());
        productoExistente.setPrecioReferencia(productoDetails.getPrecioReferencia());
        productoExistente.setStockMinimo(productoDetails.getStockMinimo());
        productoExistente.setEstado(productoDetails.getEstado());
        return productoRepository.save(productoExistente);
    }

    // (Método findAllProductos sin cambios)
    @Override
    @Transactional(readOnly = true)
    public List<Producto> findAllProductos() {
        return productoRepository.findAll();
    }

    // (Método findProductoById sin cambios)
    @Override
    @Transactional(readOnly = true)
    public Optional<Producto> findProductoById(Long id) {
        return productoRepository.findById(id);
    }

    // --- 7. MÉTODO deactivateProducto ACTUALIZADO CON SEGURIDAD ---
    @Override
    public void deactivateProducto(Long id) {

        // --- INICIO DE VALIDACIÓN DE ROL ---
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentLogin = authentication.getName();
        Usuario usuarioPeticion = userService.findUserByLogin(currentLogin)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado en contexto de seguridad"));

        // Regla: Solo el JEFE_ALMACEN puede anular productos
        if (!usuarioPeticion.getRol().getNombre().equals("JEFE_ALMACEN")) {
            throw new IllegalArgumentException("Error de Permiso: Solo un JEFE_ALMACEN puede anular productos.");
        }
        // --- FIN DE VALIDACIÓN DE ROL ---

        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));

        productoExistente.setEstado(false);
        productoRepository.save(productoExistente);
    }
}