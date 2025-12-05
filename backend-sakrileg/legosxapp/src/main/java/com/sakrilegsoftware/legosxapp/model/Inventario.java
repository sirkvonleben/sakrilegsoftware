package com.sakrilegsoftware.legosxapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "inventario")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inventario")
    private Long id; // id_inventario

    // --- Relaciones (Claves Foráneas) ---

    // Relación con Producto (Un Inventario es de UN Producto)
    @ManyToOne(fetch = FetchType.LAZY) // LAZY: Carga el producto solo cuando se necesita
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto; // id_producto del diccionario

    // Relación con Sucursal (Un Inventario es de UNA Sucursal)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sucursal", nullable = false)
    private Sucursal sucursal; // id_sucursal del diccionario

    // --- Atributos ---
    @Column(name = "stock_actual_i", nullable = false)
    private Integer stockActual; // stock_actual_i

    @Column(name = "stock_minimo_i", nullable = false)
    private Integer stockMinimo; // stock_minimo_i (RF6)

    @Column(name = "ubicacion_i") //
    private String ubicacion;

    @Column(name = "fecha_actualizacion_i") //
    private LocalDateTime fechaActualizacion;
}