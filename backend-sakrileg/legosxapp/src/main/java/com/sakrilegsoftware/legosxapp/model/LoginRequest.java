// src/main/java/com/sakrilegsoftware/legosxapp/model/LoginRequest.java
// (O en un paquete dto si lo prefiere)

package com.sakrilegsoftware.legosxapp.model;

import lombok.Data;

@Data
public class LoginRequest {
    // Estos nombres DEBEN coincidir con el JSON que enviará React
    private String login;
    private String password;
}