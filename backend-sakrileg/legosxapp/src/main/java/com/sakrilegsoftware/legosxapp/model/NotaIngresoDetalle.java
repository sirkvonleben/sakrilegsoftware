package com.sakrilegsoftware.legosxapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "nota_ingreso_d") // Detalle de Nota de Ingreso (nota_ingreso_d en el MER)
public class NotaIngresoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // Relación con la cabecera del movimiento
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_nota_ingreso")
    private NotaIngreso notaIngreso;

    // Relación con el producto que se mueve
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(name = "cantidad_nid", nullable = false)
    private Integer cantidad; // cantidad_nid

    @Column(name = "precio_unitario_nid")
    private Double precioUnitario; // precio_unitario_nid

}