package com.sakrilegsoftware.legosxapp.model; // <<-- CORREGIDO

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long id; // id_producto del diccionario

    @Column(name = "codigo", nullable = false, unique = true)
    private String codigo; // código del producto (RF11)

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "talla")
    private String talla;

    @Column(name = "color")
    private String color;

    @Column(name = "precio_referencia", nullable = false)
    private Double precioReferencia; // precio_p del diccionario

    @Column(name = "estado", nullable = false)
    private Boolean estado = true; // activo/inactivo (RF11)

    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo;

    // La entidad Inventario (que tiene el stock) se relaciona con esta.
}