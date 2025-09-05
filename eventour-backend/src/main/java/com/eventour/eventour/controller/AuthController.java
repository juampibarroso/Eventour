package com.eventour.eventour.controller;

import com.eventour.eventour.security.jwt.JwtUtil;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(
        value = "/login",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        // Aceptar "username" o "email" (por si el front envía email)
        String username = body.getOrDefault("username", body.get("email"));
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "username/password requeridos"));
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        String firstRole = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // e.g. ROLE_ADMIN
                .findFirst()
                .orElse("ROLE_USER");

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", firstRole.replace("ROLE_", "") // ADMIN / USER
        ));
    }

    @GetMapping("/whoami")
    public ResponseEntity<?> whoami(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(Map.of("auth", authHeader));
    }
}
