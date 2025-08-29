package com.eventour.eventour.controller;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.service.UbicacionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/ubicaciones", produces = MediaType.APPLICATION_JSON_VALUE)
public class UbicacionController {

    private final UbicacionService ubicacionService;

    public UbicacionController(UbicacionService ubicacionService) {
        this.ubicacionService = ubicacionService;
    }

    // --- Crear (robusto: parseamos el JSON manualmente desde Map)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> crear(@RequestBody Map<String, Object> body) {
        UbicacionDTO creada = ubicacionService.crearDesdeMapa(body);
        return ResponseEntity.ok(creada);
    }

    // --- Listar
    @GetMapping
    public ResponseEntity<List<UbicacionDTO>> listar() {
        return ResponseEntity.ok(ubicacionService.listarUbicaciones());
    }

    // --- Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<UbicacionDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionPorId(id));
    }

    // --- Actualizar (también desde Map para mantener la robustez)
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> actualizar(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        UbicacionDTO actualizada = ubicacionService.actualizarDesdeMapa(id, body);
        return ResponseEntity.ok(actualizada);
    }

    // --- Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ubicacionService.eliminarUbicacion(id);
        return ResponseEntity.noContent().build();
    }

    // --- (Opcional) eco para depurar rápidamente
    @PostMapping(path = "/_echo", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> echo(@RequestBody Map<String, Object> body) {
        return body;
    }
}
