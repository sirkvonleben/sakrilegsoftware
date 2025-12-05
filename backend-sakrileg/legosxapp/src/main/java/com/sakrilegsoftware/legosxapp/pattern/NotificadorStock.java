package com.sakrilegsoftware.legosxapp.pattern;

import com.sakrilegsoftware.legosxapp.model.Inventario;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct; // Para registrarse al iniciar

/**
 * El Observador Concreto: Se encarga de procesar la alerta (RF-05).
 * Simula el envío de un email al Gerente/Compras.
 */
@Component // Marcamos como Componente de Spring
public class NotificadorStock implements Observador {

    // Inyectamos el Sujeto (InventarioObservable) para registrarnos
    private final InventarioObservable inventarioObservable;

    public NotificadorStock(InventarioObservable inventarioObservable) {
        this.inventarioObservable = inventarioObservable;
    }

    // Este método se ejecuta después de que Spring crea el componente
    @PostConstruct
    public void registrarObservador() {
        System.out.println("LOG (Observer Pattern): Registrando NotificadorStock...");
        inventarioObservable.agregar(this);
    }

    @Override
    public void actualizar(Inventario inventario, String mensaje) {
        // Lógica para enviar la notificación (Email, SMS, Notificación Web)
        String alerta = String.format(
                "[%s - %s] Producto: %s. Stock Actual: %d. Mínimo Requerido: %d. %s",
                "Email-Alerta",
                inventario.getSucursal().getNombre(),
                inventario.getProducto().getNombre(),
                inventario.getStockActual(),
                inventario.getStockMinimo(),
                mensaje);

        // Simulación de envío de alerta
        System.out.println("************************************************************");
        System.out.println("ENVIANDO ALERTA A GERENCIA Y COMPRAS (RF-05): " + alerta);
        System.out.println("************************************************************");
    }
}