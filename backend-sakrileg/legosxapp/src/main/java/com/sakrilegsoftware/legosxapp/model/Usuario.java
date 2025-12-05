package com.sakrilegsoftware.legosxapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "login_u", nullable = false, length = 50, unique = true)
    private String login;

    @Column(name = "clave", nullable = false, length = 255)
    private String password;

    // --- ¡CAMBIO AQUÍ! ---
    // Cambiado de LAZY a EAGER para solucionar el error de serialización de Jackson
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    @Column(name = "nombre_u", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellido_u", nullable = false, length = 100)
    private String apellido;

    @Column(name = "correo_u", length = 100, unique = true)
    private String correo;

    @Column(name = "celular_u", length = 20)
    private String celular;

    @Column(name = "cargo_u", length = 50)
    private String cargo;

    // --- ¡CAMBIO AQUÍ! ---
    // Cambiado de LAZY a EAGER para solucionar el error de serialización de Jackson
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_sucursal", nullable = false)
    private Sucursal sucursal;

    @Column(name = "estado_u", nullable = false)
    private Boolean estado = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}