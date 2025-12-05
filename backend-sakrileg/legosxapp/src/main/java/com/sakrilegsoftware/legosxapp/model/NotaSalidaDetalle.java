// Asumo que tu archivo se llama NotaSalidaDetalle.java
package com.sakrilegsoftware.legosxapp.model;

import com.fasterxml.jackson.annotation.JsonProperty; // <-- 1. IMPORTA ESTO
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "nota_salida_d") // O como se llame tu tabla
public class NotaSalidaDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cantidad_nsd", nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario_nsd")
    private Double precioUnitario; // O como lo llames

    @JsonIgnore // <-- ¡AÑADIR ESTA LÍNEA!
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_nota_salida")
    private NotaSalida notaSalida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    // --- 2. AÑADE ESTE MÉTODO ---
    /**
     * Ayuda a Jackson a construir un Producto parcial
     * cuando recibe "id_producto" en el JSON.
     */
    @JsonProperty("id_producto")
    private void setProductoId(Long idProducto) {
        if (idProducto != null) {
            this.producto = new Producto();
            this.producto.setId(idProducto);
        }
    }

    // Asumo que tienes un método setCantidad para el JSON
    @JsonProperty("cantidad")
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}