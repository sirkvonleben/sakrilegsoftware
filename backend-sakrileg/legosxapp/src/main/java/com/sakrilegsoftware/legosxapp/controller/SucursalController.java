package com.sakrilegsoftware.legosxapp.controller;

import com.sakrilegsoftware.legosxapp.model.Sucursal;
import com.sakrilegsoftware.legosxapp.repository.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sucursales")
public class SucursalController {

    @Autowired
    private SucursalRepository sucursalRepository;

    @GetMapping
    public ResponseEntity<List<Sucursal>> obtenerTodasLasSucursales() {
        // (Opcional: crear un SucursalService es más limpio,
        // pero usar el repositorio aquí es más rápido)
        List<Sucursal> sucursales = sucursalRepository.findAll();
        return ResponseEntity.ok(sucursales);
    }
}