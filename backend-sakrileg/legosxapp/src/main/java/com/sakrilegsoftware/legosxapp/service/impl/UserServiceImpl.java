package com.sakrilegsoftware.legosxapp.service.impl;

import com.sakrilegsoftware.legosxapp.exception.ResourceNotFoundException;
import com.sakrilegsoftware.legosxapp.model.Usuario;
import com.sakrilegsoftware.legosxapp.repository.UserRepository;
import com.sakrilegsoftware.legosxapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

// --- 1. IMPORTAR CLASES DE SEGURIDAD ---
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@Service
@Transactional
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // (El constructor no necesita cambios, ya que este servicio
    // puede llamarse a sí mismo para obtener los detalles del usuario)
    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // (Método loadUserByUsername sin cambios)
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Usuario usuario = userRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con login: " + login));
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(usuario.getRol().getNombre()));
        return new User(
                usuario.getLogin(),
                usuario.getPassword(),
                authorities);
    }

    // (Método saveUser sin cambios)
    @Override
    public Usuario saveUser(Usuario usuario) {
        if (userRepository.findByLogin(usuario.getLogin()).isPresent()) {
            throw new IllegalArgumentException("El login ya está en uso.");
        }
        if (usuario.getCorreo() != null && userRepository.existsByCorreo(usuario.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado.");
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setFechaCreacion(LocalDateTime.now());
        return userRepository.save(usuario);
    }

    // (Métodos findAllUsers, findUserById, findUserByLogin sin cambios)
    @Override
    @Transactional(readOnly = true)
    public List<Usuario> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findUserByLogin(String login) {
        return userRepository.findByLogin(login);
    }

    // (Método updateUser sin cambios)
    @Override
    public Usuario updateUser(Long id, Usuario usuarioDetails) {
        Usuario usuarioExistente = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        usuarioExistente.setNombre(usuarioDetails.getNombre());
        usuarioExistente.setApellido(usuarioDetails.getApellido());
        usuarioExistente.setCorreo(usuarioDetails.getCorreo());
        usuarioExistente.setCelular(usuarioDetails.getCelular());
        usuarioExistente.setCargo(usuarioDetails.getCargo());
        usuarioExistente.setRol(usuarioDetails.getRol());
        usuarioExistente.setSucursal(usuarioDetails.getSucursal());
        usuarioExistente.setEstado(usuarioDetails.getEstado());
        return userRepository.save(usuarioExistente);
    }

    // --- 2. MÉTODO deactivateUser ACTUALIZADO CON SEGURIDAD ---
    @Override
    public void deactivateUser(Long id) {

        // --- INICIO DE VALIDACIÓN DE ROL ---
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentLogin = authentication.getName();

        // Usamos el repositorio directamente, ya que 'this.findUserByLogin'
        // es parte de la interfaz 'UserService' y no 'UserDetailsService'
        Usuario usuarioPeticion = userRepository.findByLogin(currentLogin)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado en contexto de seguridad"));

        // Regla: Solo el ADMINISTRADOR puede anular usuarios
        if (!usuarioPeticion.getRol().getNombre().equals("ADMINISTRADOR")) {
            throw new IllegalArgumentException("Error de Permiso: Solo un ADMINISTRADOR puede anular usuarios.");
        }
        // --- FIN DE VALIDACIÓN DE ROL ---

        Usuario usuarioExistente = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        usuarioExistente.setEstado(false);
        userRepository.save(usuarioExistente);
    }
}