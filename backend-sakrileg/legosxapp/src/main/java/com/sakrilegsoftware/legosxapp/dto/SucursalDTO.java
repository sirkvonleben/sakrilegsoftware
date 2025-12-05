package com.sakrilegsoftware.legosxapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SucursalDTO {
    // Campos que el frontend necesita (de CatalogoStockList.jsx)
    private Long id;
    private String nombre;
}