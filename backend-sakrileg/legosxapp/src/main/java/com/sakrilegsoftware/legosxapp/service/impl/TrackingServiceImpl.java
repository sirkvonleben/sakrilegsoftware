package com.sakrilegsoftware.legosxapp.service.impl;

import com.sakrilegsoftware.legosxapp.model.TrackingEntrega;
import com.sakrilegsoftware.legosxapp.repository.TrackingEntregaRepository;
import com.sakrilegsoftware.legosxapp.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class TrackingServiceImpl implements TrackingService {

    private final TrackingEntregaRepository trackingRepository;

    @Autowired
    public TrackingServiceImpl(TrackingEntregaRepository trackingRepository) {
        this.trackingRepository = trackingRepository;
    }

    @Override
    public TrackingEntrega save(TrackingEntrega entrega) {
        return trackingRepository.save(entrega);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrackingEntrega> findAll() {
        return trackingRepository.findAll();
    }
}