package com.sakrilegsoftware.legosxapp.service;

import com.sakrilegsoftware.legosxapp.model.TrackingEntrega;
import java.util.List;

public interface TrackingService {
    TrackingEntrega save(TrackingEntrega entrega);

    List<TrackingEntrega> findAll();
}