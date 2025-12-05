package com.sakrilegsoftware.legosxapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "tracking_entrega")
public class TrackingEntrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_entrega")
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_nota_salida", nullable = false)
    private NotaSalida notaSalida;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "transportista", length = 100)
    private String transportista;

    @Column(name = "estado", length = 50, nullable = false)
    private String estado; // (Pendiente, En Tránsito, Entregado)

    @Column(name = "observacion", length = 500)
    private String observacion;
}