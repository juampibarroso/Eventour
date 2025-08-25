package com.eventour.eventour.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import java.io.IOException;
    
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

            // 1) Si no hay header o no empieza con Bearer, NO cortar: continuar
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            // 2) Extraer token
            String token = authHeader.substring(7).trim();
            if (token.isEmpty()) {
                filterChain.doFilter(request, response);
                return;
            }

            // 3) Extraer username de forma segura
            String username;
            try {
                username = jwtUtil.getUsernameFromToken(token);
            } catch (Exception e) {
                // Token ilegible/dañado/expirado → NO bloquear aquí
                filterChain.doFilter(request, response);
                return;
            }

            // 4) Si ya hay autenticación previa, continuar
            if (username == null || SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            // 5) Validar token; si es válido, autenticar
            boolean valid;
            try {
                valid = jwtUtil.validateToken(token);
            } catch (Exception e) {
                // Cualquier excepción de validación → NO bloquear aquí
                filterChain.doFilter(request, response);
                return;
            }

            if (valid) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                var authentication = jwtUtil.getAuthentication(token, userDetails);
                // Agrega detalles de la request (ip, session, etc.)
                if (authentication != null) {
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }

            // 6) Siempre continuar la cadena
            filterChain.doFilter(request, response);

        } catch (Exception ex) {
            // Nunca devolver 401/403 desde el filtro:
            // logueá si querés, pero dejá que SecurityConfig decida según los matchers
            // (Aquí seguimos la cadena para no romper rutas publicas)
            filterChain.doFilter(request, response);
        }
    }
}
