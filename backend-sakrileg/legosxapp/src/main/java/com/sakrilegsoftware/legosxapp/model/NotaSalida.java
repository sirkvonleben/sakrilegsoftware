package com.sakrilegsoftware.legosxapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "nota_salida")
public class NotaSalida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nota_salida")
    private Long id;

    @Column(name = "fecha_ns", nullable = false, updatable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    @Column(name = "motivo_ns", nullable = false)
    private String motivo;

    @Column(name = "destino_ns")
    private String destino;

    @Column(name = "observacion_ns")
    private String observacion;

    @Column(name = "estado_ns", nullable = false)
    private String estado = "ACTIVO";

    // --- ¡CORRECCIÓN! ---
    // @JsonIgnore ha sido ELIMINADO de aquí.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // @JsonManagedReference (alternativa a @JsonIgnore en los detalles)
    @OneToMany(mappedBy = "notaSalida", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<NotaSalidaDetalle> detalles;

    // --- ¡CORRECCIÓN! ---
    // @JsonIgnore ha sido ELIMINADO de aquí.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sucursal", nullable = false)
    private Sucursal sucursal;

    // --- MÉTODOS HELPER ELIMINADOS ---
    // Los métodos setSucursalId y setUsuarioId han sido eliminados
    // porque tu formulario 'SalidaForm.jsx' ya envía el objeto anidado correcto.
    // Jackson usará los setters de Lombok (@Data) automáticamente.
}