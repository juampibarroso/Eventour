package com.eventour.eventour.config;

import com.eventour.eventour.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminInitConfig {

    @Bean
    public CommandLineRunner initAdmin(UsuarioService usuarioService) {
        return args -> {
            String adminEmail = "admin@eventour.com";
            String adminPass = "admin";

            if (usuarioService.obtenerPorUsername(adminEmail).isEmpty()) {
                usuarioService.crearAdmin(adminEmail, adminPass);
                System.out.println("✅ Admin creado automáticamente");
            } else {
                System.out.println("ℹ️ El admin ya existe. No se creó otro.");
            }
        };
    }
}
