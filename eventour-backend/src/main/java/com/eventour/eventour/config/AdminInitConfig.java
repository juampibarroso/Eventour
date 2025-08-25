package com.eventour.eventour.config;

import com.eventour.eventour.model.NombreRol;
import com.eventour.eventour.model.Rol;
import com.eventour.eventour.model.Usuario;
import com.eventour.eventour.repository.RolRepository;
import com.eventour.eventour.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

@Configuration
public class AdminInitConfig {

    private static final Logger log = LoggerFactory.getLogger(AdminInitConfig.class);

    @Bean
    public CommandLineRunner initAdmin(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // 1) Asegurar roles
            Rol rolUser = rolRepository.findByNombre(NombreRol.USER)
                    .orElseGet(() -> {
                        Rol r = new Rol();
                        r.setNombre(NombreRol.USER);
                        return rolRepository.save(r);
                    });

            Rol rolAdmin = rolRepository.findByNombre(NombreRol.ADMIN)
                    .orElseGet(() -> {
                        Rol r = new Rol();
                        r.setNombre(NombreRol.ADMIN);
                        return rolRepository.save(r);
                    });

            // 2) Asegurar admin
            String adminEmail = "admin@eventour.com";
            String adminPass = "admin"; // si querés, muévelo a variable de entorno

            Usuario admin = usuarioRepository.findByUsername(adminEmail).orElse(null);
            if (admin == null) {
                Usuario nuevo = new Usuario();
                nuevo.setUsername(adminEmail);
                nuevo.setPassword(passwordEncoder.encode(adminPass));
                nuevo.setRoles(Collections.singleton(rolAdmin));
                usuarioRepository.save(nuevo);
                log.info("✅ Admin creado: {}", adminEmail);
            } else {
                // Si el password no parece BCrypt (no empieza con $2) → lo re-encodeamos
                if (admin.getPassword() == null || !admin.getPassword().startsWith("$2")) {
                    admin.setPassword(passwordEncoder.encode(adminPass));
                    admin.setRoles(Collections.singleton(rolAdmin)); // fuerza rol admin
                    usuarioRepository.save(admin);
                    log.warn("🛠️ Admin existente con password no-bcrypt. Se re-encriptó.");
                } else {
                    // Nos aseguramos que tenga el rol ADMIN
                    if (admin.getRoles() == null || admin.getRoles().stream().noneMatch(r -> r.getNombre() == NombreRol.ADMIN)) {
                        admin.setRoles(Collections.singleton(rolAdmin));
                        usuarioRepository.save(admin);
                        log.warn("🛠️ Admin existente sin rol ADMIN. Rol corregido.");
                    } else {
                        log.info("ℹ️ Admin ya presente y válido.");
                    }
                }
            }
        };
    }
}
