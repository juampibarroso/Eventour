package com.eventour.eventour.controller;

import com.eventour.eventour.dto.UsuarioDTO;
import com.eventour.eventour.model.NombreRol;
import com.eventour.eventour.model.Rol;
import com.eventour.eventour.model.Usuario;
import com.eventour.eventour.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

@Autowired
    private UsuarioService usuarioService;

@GetMapping
    public List<UsuarioDTO> obtenerTodos(){
    return usuarioService.obtenerTodos().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
}

//Obtener user por id
@GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable Long id){
    return usuarioService.obtenerPorId(id)
            .map(usuario -> ResponseEntity.ok(convertirADTO(usuario)))
            .orElse(ResponseEntity.notFound().build());
}
    //Crear un usuario (asigna USER por defecto si no se pasa un rol)
    @PostMapping("/crear")
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioService.crearUsuario(usuarioDTO.username(), usuarioDTO.password());
        return ResponseEntity.ok(convertirADTO(usuario));
    }


    //Crear un ADMIN (esto solo tiene que ser accesible por otro ADMIN)
    @PostMapping("/crearAdmin")
    public ResponseEntity<UsuarioDTO> crearAdmin(@RequestBody UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioService.crearAdmin(usuarioDTO.username(), usuarioDTO.password());
        return ResponseEntity.ok(convertirADTO(usuario));
    }


    //no se si esta la vamos a usar
    @PostMapping
    public UsuarioDTO crear(@RequestBody UsuarioDTO usuarioDTO) {
        Usuario usuario = convertirAEntidad(usuarioDTO);
        return convertirADTO(usuarioService.guardar(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (usuarioService.obtenerPorId(id).isPresent()) {
            usuarioService.eliminar(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    private UsuarioDTO convertirADTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getUsername(),
                null,
                usuario.getRoles().stream()
                        .map(rol -> rol.getNombre().name())
                        .collect(Collectors.toSet())
        );
    }




    private Usuario convertirAEntidad(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setId(dto.id()); //
        usuario.setUsername(dto.username()); //

        // Convertir Set<String> a Set<Rol>
        if (dto.roles() != null) {
            Set<Rol> roles = dto.roles().stream()
                    .map(nombreRol -> {
                        Rol rol = new Rol();
                        rol.setNombre(NombreRol.valueOf(nombreRol)); // Convertir String a Enum
                        return rol;
                    })
                    .collect(Collectors.toSet());
            usuario.setRoles(roles); //
        }

        return usuario;
    }


}
