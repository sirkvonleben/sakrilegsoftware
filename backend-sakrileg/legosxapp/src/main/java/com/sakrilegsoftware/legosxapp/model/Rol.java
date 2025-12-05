package com.sakrilegsoftware.legosxapp.model; // Asegúrate de que esta ruta sea correcta

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long id;

    // Columna para el nombre del rol (ADMINISTRADOR, JEFE_ALMACEN, OPERADOR)
    @Column(name = "nombre_rol", nullable = false, length = 50, unique = true)
    private String nombre;

    @Column(name = "descripcion", length = 255)
    private String descripcion;
}