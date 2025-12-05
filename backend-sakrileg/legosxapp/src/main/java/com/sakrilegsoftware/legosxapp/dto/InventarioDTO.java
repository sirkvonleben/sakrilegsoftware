package com.sakrilegsoftware.legosxapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class InventarioDTO {

    // Campos de Inventario que el frontend usa
    private Long id;
    private Integer stockActual;
    private Integer stockMinimo;
    private String ubicacion;
    private LocalDateTime fechaActualizacion;

    // ¡Aquí está la clave! Usamos los DTOs anidados
    private ProductoDTO producto;
    private SucursalDTO sucursal;
}