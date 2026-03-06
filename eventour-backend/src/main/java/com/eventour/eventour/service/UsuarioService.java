package com.eventour.eventour.service;

import com.eventour.eventour.model.NombreRol;
import com.eventour.eventour.model.Rol;
import com.eventour.eventour.model.Usuario;
import com.eventour.eventour.repository.RolRepository;
import com.eventour.eventour.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- CRUD básicos ---
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> obtenerPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public Usuario guardar(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword())); // 🔒 siempre encripta
        return usuarioRepository.save(usuario);
    }

    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    // 👤 Crear usuario estándar con rol USER
    public Usuario crearUsuario(String username, String password) {
        if (!esEmailValido(username)) {
            throw new RuntimeException("Error: El email ingresado no es válido.");
        }

        if (usuarioRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Error: El email ya está registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(password)); // 🔒 encriptar siempre

        Rol rolUser = rolRepository.findByNombre(NombreRol.USER)
                .orElseThrow(() -> new RuntimeException("Error: Rol USER no encontrado"));

        usuario.setRoles(Collections.singleton(rolUser));
        return usuarioRepository.save(usuario);
    }

    // 👑 Crear admin con rol ADMIN
    public Usuario crearAdmin(String username, String password) {
        if (usuarioRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Error: El usuario ya existe.");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(password)); // 🔒 encriptar siempre

        Rol rolAdmin = rolRepository.findByNombre(NombreRol.ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Rol ADMIN no encontrado"));

        usuario.setRoles(Collections.singleton(rolAdmin));
        return usuarioRepository.save(usuario);
    }

    // Validación de email
    private boolean esEmailValido(String email) {
        if (email == null || email.isEmpty()) return false;
        return Pattern.compile(EMAIL_REGEX).matcher(email).matches();
    }
}
