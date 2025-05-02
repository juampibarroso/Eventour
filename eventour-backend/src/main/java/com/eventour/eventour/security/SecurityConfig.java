package com.eventour.eventour.security;

import com.eventour.eventour.security.jwt.JwtAuthenticationFilter;
import com.eventour.eventour.security.jwt.JwtUtil;
import com.eventour.eventour.util.ApplicationContextProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
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

    @Autowired
    private UserDetailsService userDetailsService;

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
                                "/api/auth/**",          // Registro y login
                                "/api/eventos",         // Listar eventos
                                "/api/eventos/filtrar", // Filtrar eventos
                                "/api/eventos/buscar",  // Buscar por nombre
                                "/api/eventos/buscar-por-fechas", // Buscar por fecha
                                "/api/ubicaciones",     // Listar ubicaciones
                                "/api/ubicaciones/{id}", // Ver ubicación por ID
                                "/api/eventos/{id}"
                        ).permitAll()

                        // **Rutas protegidas solo para usuarios autenticados**
                        .requestMatchers(
                                "/api/eventos/user/**", // Solo usuarios registrados pueden acceder
                                "/api/categorias/user/**"
                        ).hasAuthority("ROLE_USER")

                        // **Rutas restringidas solo para administradores**
                        .requestMatchers(
                                "/api/admin/**",
//                                "/api/eventos",       // Crear eventos
//                                "/api/eventos/{id}",  // Actualizar y eliminar eventos
                                "/api/categorias/admin/**",
                                "/api/usuarios/crearAdmin", // Crear ADMIN
                                "/api/usuarios/**",   // Listar, obtener y eliminar usuarios
                                "/api/ubicaciones"    // Crear ubicación
                        ).permitAll() //CAMBIAR POR EL DE ABAJO, ESTO ES SOLO PARA TESTEAR!!!
                        //.hasAuthority("ROLE_ADMIN")

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
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder) throws Exception {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authProvider);
    }

    }




