package com.sakrilegsoftware.legosxapp.controller; // ¡Asegúrate de que esta ruta sea correcta!

import com.sakrilegsoftware.legosxapp.model.Usuario;
import com.sakrilegsoftware.legosxapp.service.UserService;
import com.sakrilegsoftware.legosxapp.exception.ResourceNotFoundException; // Importamos la excepción
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Define la clase como un controlador REST
@RequestMapping("/api/v1/usuarios") // URL base para todos los métodos: /api/v1/usuarios
public class UserController {

    private final UserService userService;

    // Inyección de Dependencias (DIP)
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // RF-01: Crear un nuevo usuario
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = userService.saveUser(usuario);
        // Retorna 201 Created
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    // RF-01: Obtener la lista de todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = userService.findAllUsers();
        // Retorna 200 OK
        return ResponseEntity.ok(usuarios);
    }

    // RF-01: Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        // Maneja el Optional y la respuesta 404 (si no existe)
        return userService.findUserById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
    }

    // RF-01 y RF-02: Actualizar un usuario y su rol
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioDetails) {
        try {
            Usuario usuarioActualizado = userService.updateUser(id, usuarioDetails);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (ResourceNotFoundException e) {
            // El servicio lanza la excepción 404 que Spring maneja
            throw e;
        }
    }

    // RF-01 (Anular/Desactivar): Desactivar un usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarUsuario(@PathVariable Long id) {
        try {
            userService.deactivateUser(id);
            // Retorna 204 No Content para indicar éxito
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            throw e;
        }
    }
}