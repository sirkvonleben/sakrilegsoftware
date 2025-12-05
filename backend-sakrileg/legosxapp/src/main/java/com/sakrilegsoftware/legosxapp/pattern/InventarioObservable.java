package com.sakrilegsoftware.legosxapp.pattern;

import com.sakrilegsoftware.legosxapp.model.Inventario;
import org.springframework.stereotype.Component; // Para que Spring pueda inyectarlo
import java.util.ArrayList;
import java.util.List;

/**
 * El Sujeto Concreto: Maneja la lógica de notificaciones de stock (RF-05).
 * Se inyectará en el InventarioService para ser utilizado.
 */
@Component // Marcamos como Componente de Spring
public class InventarioObservable implements Sujeto {

    // Lista de todos los observadores (notificadores)
    private final List<Observador> observadores = new ArrayList<>();

    @Override
    public void agregar(Observador observador) {
        observadores.add(observador);
    }

    @Override
    public void eliminar(Observador observador) {
        observadores.remove(observador);
    }

    @Override
    public void notificar(Inventario inventario) {
        // Notifica a todos los observadores registrados
        for (Observador observador : observadores) {
            observador.actualizar(inventario, "¡ALERTA! El stock actual ha caído por debajo del mínimo.");
        }
    }

    /**
     * Método clave de negocio: Invocado después de cada Nota de Salida.
     * Aquí es donde se verifica la condición de notificar (stock_actual <
     * stock_minimo).
     */
    public void verificarStockMinimo(Inventario inventario) {
        if (inventario.getStockActual() < inventario.getStockMinimo()) {
            System.out.println("LOG (Observer Pattern): Stock del producto '"
                    + inventario.getProducto().getNombre() + "' en estado crítico.");

            // Dispara la notificación
            this.notificar(inventario);
        }
    }
}