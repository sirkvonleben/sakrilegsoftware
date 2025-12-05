package com.sakrilegsoftware.legosxapp.controller;

import com.sakrilegsoftware.legosxapp.model.TrackingEntrega;
import com.sakrilegsoftware.legosxapp.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tracking")
public class TrackingController {

    private final TrackingService trackingService;

    @Autowired
    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @GetMapping
    public ResponseEntity<List<TrackingEntrega>> obtenerTodoElTracking() {
        List<TrackingEntrega> trackingList = trackingService.findAll();
        return ResponseEntity.ok(trackingList);
    }

    // (Aquí puedes añadir @PutMapping("/{id}") en el futuro
    // para actualizar el estado de una entrega, ej: "En Tránsito" -> "Entregado")
}