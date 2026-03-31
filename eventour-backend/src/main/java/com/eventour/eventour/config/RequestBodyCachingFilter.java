package com.eventour.eventour.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;

public class RequestBodyCachingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // Si ya es un wrapper, úsalo; si no, envuélvelo
        ContentCachingRequestWrapper wrapped =
                (request instanceof ContentCachingRequestWrapper)
                        ? (ContentCachingRequestWrapper) request
                        : new ContentCachingRequestWrapper(request);

        filterChain.doFilter(wrapped, response);
        // No es necesario leer aquí; el objetivo es que los siguientes componentes
        // (incluído tu controller) puedan leer el body sin que “desaparezca”.
    }
}
