package com.eventour.eventour.controller;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.service.UbicacionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/ubicaciones", produces = MediaType.APPLICATION_JSON_VALUE)
public class UbicacionController {

    private final UbicacionService ubicacionService;

    public UbicacionController(UbicacionService ubicacionService) {
        this.ubicacionService = ubicacionService;
    }

    // ------- Crear (JSON → DTO), SOLO ADMIN por SecurityConfig -------
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> crear(@RequestBody UbicacionDTO dto) {
        // Validación mínima: pedimos oasis
        if (dto.oasis() == null) {
            return ResponseEntity.badRequest().build();
        }
        UbicacionDTO creada = ubicacionService.crearUbicacion(dto);
        return ResponseEntity.ok(creada);
    }

    // ------- Listar (público) -------
    @GetMapping
    public ResponseEntity<List<UbicacionDTO>> listar() {
        return ResponseEntity.ok(ubicacionService.listarUbicaciones());
    }

    // ------- Detalle (público) -------
    @GetMapping("/{id}")
    public ResponseEntity<UbicacionDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionPorId(id));
    }

    // ------- Actualizar (ADMIN) -------
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> actualizar(@PathVariable Long id, @RequestBody UbicacionDTO dto) {
        return ResponseEntity.ok(ubicacionService.actualizarUbicacion(id, dto));
    }

    // ------- Eliminar (ADMIN) -------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ubicacionService.eliminarUbicacion(id);
        return ResponseEntity.noContent().build();
    }
}
