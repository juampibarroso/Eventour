package com.eventour.eventour.controller;

import com.eventour.eventour.dto.AuthRequest;
import com.eventour.eventour.dto.AuthResponse;
import com.eventour.eventour.model.Usuario;
import com.eventour.eventour.repository.UsuarioRepository;
import com.eventour.eventour.security.jwt.JwtUtil;
import com.eventour.eventour.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;


    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserDetailsService userDetailsService, UsuarioRepository usuarioRepository, UsuarioService usuarioService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
    }



    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.username());
        Optional<Usuario> usuarioOptional = usuarioRepository.findByUsername(authRequest.username());

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Error: Usuario no encontrado"));
        }

        String role = usuarioOptional.get().getRoles().stream()
                .findFirst()
                .map(rol -> rol.getNombre().name())
                .orElse("USER");

        String token = jwtUtil.generateToken(userDetails, role);

        return ResponseEntity.ok(new AuthResponse(token, role));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {

        if(request.username() == null || request.password() == null || request.username().isEmpty() || request.password().isEmpty()){
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Error: Email o contraseña no pueden estar vacíos."));
        }


        Usuario usuario = usuarioService.crearUsuario(request.username(), request.password());
        UserDetails userDetails = usuarioService.loadUserByUsername((usuario.getUsername()));
        String token = jwtUtil.generateToken(userDetails, "USER");

        return ResponseEntity.ok(new AuthResponse(token, "USER"));
    }


}
