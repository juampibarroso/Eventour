package com.eventour.eventour.security;

import com.eventour.eventour.security.jwt.JwtAuthenticationFilter;
import com.eventour.eventour.security.jwt.JwtUtil;
import com.eventour.eventour.util.ApplicationContextProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {


    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(@Lazy JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter; // ✅ Se inyecta con `@Lazy` para evitar el ciclo
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {


        return http
                .csrf(csrf -> csrf.disable()) // Desactivar CSRF en APIs REST
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Sin sesiones
                .authorizeHttpRequests(auth -> auth

                        // **Rutas públicas**: cualquiera puede acceder, incluso sin autenticación
                        .requestMatchers(
                                "/api/auth/**",   // Registro y autenticación (login, register)
                                "/api/eventos/public/**", // Eventos accesibles sin login
                                "/api/categorias/public/**", // Categorías accesibles sin login
                                "/public/**" // Otras rutas públicas
                        ).permitAll()

                        // **Rutas protegidas solo para usuarios autenticados**
                        .requestMatchers(
                                "/api/eventos/user/**", // Solo usuarios registrados pueden acceder
                                "/api/categorias/user/**"
                        ).hasRole("USER")

                        // **Rutas restringidas solo para administradores**
                        .requestMatchers(
                                "/api/admin/**", // Acceso solo para ADMIN
                                "/api/eventos/admin/**",
                                "/api/categorias/admin/**",
                                "/api/usuarios/crearAdmin"
                        ).hasRole("ADMIN")

                        // **Cualquier otra solicitud requiere autenticación**
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


    }




