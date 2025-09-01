package com.eventour.eventour.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, @Lazy UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");

            // Sin Authorization o sin "Bearer " → continuar
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            // Extraer token
            String token = authHeader.substring(7).trim();
            if (token.isEmpty()) {
                filterChain.doFilter(request, response);
                return;
            }

            // Extraer username con tolerancia a errores
            String username;
            try {
                username = jwtUtil.getUsernameFromToken(token);
            } catch (Exception e) {
                filterChain.doFilter(request, response);
                return;
            }

            // Si ya hay autenticación o no hay username → continuar
            if (username == null || SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            // Validar token
            boolean valid;
            try {
                valid = jwtUtil.validateToken(token);
            } catch (Exception e) {
                filterChain.doFilter(request, response);
                return;
            }

            if (valid) {
                // Cargar el usuario (si tu lógica lo requiere para más datos)
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Leer claim "role" y normalizar a ROLE_...
                String roleClaim = null;
                try {
                    // Implementa en tu JwtUtil un extractor de claims genérico o específico para "role"
                    roleClaim = jwtUtil.getClaim(token, "role"); // devuelve "ADMIN" o "ROLE_ADMIN"
                } catch (Exception ignored) {
                }

                if (roleClaim == null || roleClaim.isBlank()) {
                    // Si no viene role, no seteamos Authentication para no pasar reglas de seguridad
                    filterChain.doFilter(request, response);
                    return;
                }

                String normalized = roleClaim.startsWith("ROLE_") ? roleClaim : "ROLE_" + roleClaim;

                var authorities = List.of(new SimpleGrantedAuthority(normalized));

                var authentication = new UsernamePasswordAuthenticationToken(
                        userDetails.getUsername(), // principal (o userDetails)
                        null,
                        authorities
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            // Continuar la cadena SIEMPRE
            filterChain.doFilter(request, response);

        } catch (Exception ex) {
            // Nunca respondas 401/403 acá. Dejá que Security decida.
            filterChain.doFilter(request, response);
        }
    }
}
