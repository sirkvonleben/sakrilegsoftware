package com.sakrilegsoftware.legosxapp.controller;

import com.sakrilegsoftware.legosxapp.config.JwtUtil;
import com.sakrilegsoftware.legosxapp.model.AuthResponse;
import com.sakrilegsoftware.legosxapp.model.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService; // Esto carga tu UserServiceImpl

    @Autowired
    private JwtUtil jwtUtil;

    // Necesitamos acceder al repositorio para sacar el rol real
    @Autowired
    private com.sakrilegsoftware.legosxapp.repository.UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. Autenticar
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getLogin(),
                            loginRequest.getPassword()));

            // 2. Cargar detalles
            final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getLogin());
            final String jwtToken = jwtUtil.generateToken(userDetails);

            // 3. Obtener el usuario completo de la BD para sacar el Rol y Nombre
            var usuarioReal = userRepository.findByLogin(loginRequest.getLogin()).orElseThrow();
            String nombreCompleto = usuarioReal.getNombre() + " " + usuarioReal.getApellido();
            String rolNombre = usuarioReal.getRol().getNombre();

            // 4. Retornar todo en la respuesta
            return ResponseEntity.ok(new AuthResponse(jwtToken, "Login exitoso", nombreCompleto, rolNombre));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, "Credenciales inválidas", null, null));
        }
    }
}