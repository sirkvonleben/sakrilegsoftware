package com.sakrilegsoftware.legosxapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List; // Para los detalles

@Data
@NoArgsConstructor
@Entity
@Table(name = "nota_ingreso")
public class NotaIngreso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nota_ingreso") // Basado en el MER
    private Long id;

    @Column(name = "fecha_ni", nullable = false) //
    private LocalDateTime fecha = LocalDateTime.now();

    @Column(name = "origen_ni", length = 255) //
    private String origen;

    @Column(name = "motivo_ni", length = 50) //
    private String motivo;

    @Column(name = "observacion_ni", length = 500) //
    private String observacion;

    @Column(name = "estado_ni", length = 20) //
    private String estado = "ACTIVO";

    // --- Relaciones (Claves Foráneas) ---

    // Un movimiento es registrado por un Usuario (Auditoría RNF-06)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false) //
    private Usuario usuario;

    // Un movimiento es para una Sucursal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sucursal", nullable = false) //
    private Sucursal sucursal;

    // Relación con el detalle (uno a muchos)
    // Carga ansiosa (EAGER) para que los detalles vengan con la nota
    @OneToMany(mappedBy = "notaIngreso", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<NotaIngresoDetalle> detalles;
}