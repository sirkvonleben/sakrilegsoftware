package com.sakrilegsoftware.legosxapp;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class EncodingTest {

    @Test
    public void generar_hashes_para_sql() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        String passAdmin = "admin123";
        String passJefe = "jefe123";
        String passOp = "op123";

        System.out.println("Hash para 'admin123': " + encoder.encode(passAdmin));
        System.out.println("Hash para 'jefe123': " + encoder.encode(passJefe));
        System.out.println("Hash para 'op123': " + encoder.encode(passOp));
    }
}