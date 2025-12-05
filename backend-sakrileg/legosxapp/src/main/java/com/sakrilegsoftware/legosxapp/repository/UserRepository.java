package com.sakrilegsoftware.legosxapp.repository;

import com.sakrilegsoftware.legosxapp.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Usuario, Long> {

    // Búsqueda esencial para la autenticación (RF-03)
    Optional<Usuario> findByLogin(String login);

    // Búsqueda para evitar duplicados
    boolean existsByCorreo(String correo);

    @Override
    @Query("SELECT u FROM Usuario u JOIN FETCH u.rol JOIN FETCH u.sucursal")
    List<Usuario> findAll();

}