package com.sakrilegsoftware.legosxapp.service.impl;

import com.sakrilegsoftware.legosxapp.pattern.InventarioObservable;
import com.sakrilegsoftware.legosxapp.dto.InventarioDTO;
import com.sakrilegsoftware.legosxapp.dto.ProductoDTO;
import com.sakrilegsoftware.legosxapp.dto.SucursalDTO;
import com.sakrilegsoftware.legosxapp.exception.ResourceNotFoundException;
import com.sakrilegsoftware.legosxapp.model.Inventario;
import com.sakrilegsoftware.legosxapp.model.Producto;
import com.sakrilegsoftware.legosxapp.model.Sucursal;
import com.sakrilegsoftware.legosxapp.repository.InventarioRepository;
import com.sakrilegsoftware.legosxapp.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventarioServiceImpl implements InventarioService {

    private final InventarioRepository inventarioRepository;
    private final InventarioObservable inventarioObservable;

    @Autowired
    public InventarioServiceImpl(InventarioRepository inventarioRepository,
            InventarioObservable inventarioObservable) {
        this.inventarioRepository = inventarioRepository;
        this.inventarioObservable = inventarioObservable;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioDTO> findAllInventarioDTOs() {
        return inventarioRepository.findAllOptimized()
                .stream()
                .map(this::convertirAInventarioDTO)
                .collect(Collectors.toList());
    }

    private InventarioDTO convertirAInventarioDTO(Inventario inventario) {
        InventarioDTO dto = new InventarioDTO();
        dto.setId(inventario.getId());
        dto.setStockActual(inventario.getStockActual());
        dto.setStockMinimo(inventario.getStockMinimo());
        dto.setUbicacion(inventario.getUbicacion());
        dto.setFechaActualizacion(inventario.getFechaActualizacion());
        if (inventario.getProducto() != null) {
            dto.setProducto(new ProductoDTO(
                    inventario.getProducto().getId(),
                    inventario.getProducto().getNombre(),
                    inventario.getProducto().getCodigo()));
        }
        if (inventario.getSucursal() != null) {
            dto.setSucursal(new SucursalDTO(
                    inventario.getSucursal().getId(),
                    inventario.getSucursal().getNombre()));
        }
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Inventario> findInventarioByProductoSucursal(Producto producto, Sucursal sucursal) {
        return inventarioRepository.findByProductoAndSucursal(producto, sucursal);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validarStockDisponible(Producto producto, Sucursal sucursal, int cantidad) {
        Inventario inventario = findInventarioByProductoSucursal(producto, sucursal)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventario no encontrado para el producto: " + producto.getNombre() + " en sucursal: "
                                + sucursal.getNombre()));

        return inventario.getStockActual() >= cantidad;
    }

    @Override
    public Inventario aumentarStock(Producto producto, Sucursal sucursal, int cantidad) {
        Inventario inventario = findInventarioByProductoSucursal(producto, sucursal)
                .orElseGet(() -> {
                    Inventario nuevoInventario = new Inventario();
                    nuevoInventario.setProducto(producto);
                    nuevoInventario.setSucursal(sucursal);
                    nuevoInventario.setStockActual(0);
                    nuevoInventario.setStockMinimo(producto.getStockMinimo() != null ? producto.getStockMinimo() : 0);
                    return nuevoInventario;
                });

        inventario.setStockActual(inventario.getStockActual() + cantidad);
        inventario.setFechaActualizacion(LocalDateTime.now());
        return inventarioRepository.save(inventario);
    }

    @Override
    public Inventario disminuirStock(Producto producto, Sucursal sucursal, int cantidad) {
        if (!validarStockDisponible(producto, sucursal, cantidad)) {
            throw new IllegalArgumentException("Stock insuficiente para la operación de salida.");
        }
        Inventario inventario = findInventarioByProductoSucursal(producto, sucursal).get();
        inventario.setStockActual(inventario.getStockActual() - cantidad);
        inventario.setFechaActualizacion(LocalDateTime.now());

        inventarioObservable.verificarStockMinimo(inventario); // (Llamada al observer)

        return inventarioRepository.save(inventario);
    }
}