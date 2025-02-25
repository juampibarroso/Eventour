package com.eventour.eventour.service;

import com.eventour.eventour.model.NombreRol;
import com.eventour.eventour.model.Rol;
import com.eventour.eventour.model.Usuario;
import com.eventour.eventour.repository.RolRepository;
import com.eventour.eventour.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class UsuarioService  implements UserDetailsService {


    private  final UsuarioRepository usuarioRepository;

    private final RolRepository rolRepository;

    private  final PasswordEncoder passwordEncoder;




    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder; // ✅ Se inyecta en el constructor, eliminando dependencias circulares

    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        String[] roles = usuario.getRoles().stream()
                .map(rol -> rol.getNombre().name())
                .toArray(String[]::new); // ✅ Se obtiene correctamente la lista de roles del usuario


        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .roles(roles)
                .build();

    }

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
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    //Crea un user con Rol de USER por defecto
    public Usuario crearUsuario(String username, String password) {

        if (!esEmailValido(username)) {
            throw new RuntimeException("Error: El email ingresado no es válido.");
        }

        if (usuarioRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Error: El email ya está registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(password)); // Recuerda encriptar la contraseña en producción

        // Obtener el rol USER desde la base de datos
        Rol rolUser = rolRepository.findByNombre(NombreRol.USER)
                .orElseThrow(() -> new RuntimeException("Error: Rol USER no encontrado"));


        usuario.setRoles(Collections.singleton(rolUser));

        return usuarioRepository.save(usuario);
    }

    //Crea user con rol de ADMIN (solo deberia acceder el admin)
    public Usuario crearAdmin(String username, String password) {
        if (usuarioRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Error: El usuario ya existe.");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(password));

        // Obtener el rol ADMIN desde la base de datos
        Rol rolAdmin = rolRepository.findByNombre(NombreRol.ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Rol ADMIN no encontrado"));

        usuario.setRoles(Collections.singleton(rolAdmin));

        return usuarioRepository.save(usuario);
    }

    // para validar formato de email
    private boolean esEmailValido(String email) {
        if (email == null || email.isEmpty()){
            return false;
        }
        return Pattern.compile(EMAIL_REGEX).matcher(email).matches();
    }
}
