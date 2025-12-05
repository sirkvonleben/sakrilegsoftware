package com.sakrilegsoftware.legosxapp.service; // ¡Asegúrate de que esta ruta sea correcta!

import com.sakrilegsoftware.legosxapp.model.Usuario; // Importa la entidad Usuario
import java.util.List;
import java.util.Optional;

// Una interfaz que define el contrato del servicio de Usuarios.
// Implementa DIP y SRP de SOLID.
public interface UserService {

    /**
     * RF-01: Registra un nuevo usuario en el sistema.
     * 
     * @param usuario El objeto Usuario a guardar.
     * @return El Usuario guardado con su ID generado.
     */
    Usuario saveUser(Usuario usuario);

    /**
     * RF-01: Obtiene una lista de todos los usuarios.
     * 
     * @return Lista de todos los usuarios.
     */
    List<Usuario> findAllUsers();

    /**
     * RF-01: Busca un usuario por su ID.
     * 
     * @param id El ID del usuario.
     * @return Un Optional que contiene el usuario si existe.
     */
    Optional<Usuario> findUserById(Long id);

    /**
     * RF-01 y RF-02: Actualiza los datos y el rol de un usuario existente.
     * 
     * @param id             El ID del usuario a actualizar.
     * @param usuarioDetails Los nuevos detalles del usuario.
     * @return El Usuario actualizado.
     */
    Usuario updateUser(Long id, Usuario usuarioDetails);

    /**
     * RF-01 (Anular/Desactivar): Cambia el estado del usuario a inactivo.
     * (Cumple con la Auditoría RNF-06 al no borrar el registro).
     * 
     * @param id El ID del usuario a desactivar.
     */
    void deactivateUser(Long id);

    /**
     * RF-03: Método para la autenticación y validación de credenciales.
     */
    Optional<Usuario> findUserByLogin(String login);
}