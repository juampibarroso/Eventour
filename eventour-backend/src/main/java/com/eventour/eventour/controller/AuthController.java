package com.eventour.eventour.controller;

import com.eventour.eventour.security.jwt.JwtUtil;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        // Para el front: devolvemos la PRIMER autoridad; ya viene como ROLE_*
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
    public ResponseEntity<?> whoami(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(Map.of("auth", authHeader));
    }
}
