package com.eventour.eventour.controller;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.service.UbicacionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        value = "/api/ubicaciones",
        produces = MediaType.APPLICATION_JSON_VALUE
)
public class UbicacionController {

    private final UbicacionService ubicacionService;

    public UbicacionController(UbicacionService ubicacionService) {
        this.ubicacionService = ubicacionService;
    }

    // ---------- CREATE ----------
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> crear(@RequestBody UbicacionDTO dto) {
        // Validación mínima para evitar 500 por null en la entidad
        if (dto.oasis() == null) {
            return ResponseEntity.badRequest().build();
        }
        UbicacionDTO nueva = ubicacionService.crearUbicacion(dto);
        return ResponseEntity.ok(nueva);
    }

    // ---------- READ ----------
    @GetMapping
    public ResponseEntity<List<UbicacionDTO>> listar() {
        return ResponseEntity.ok(ubicacionService.listarUbicaciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UbicacionDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionPorId(id));
    }

    // ---------- UPDATE ----------
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> actualizar(
            @PathVariable Long id,
            @RequestBody UbicacionDTO dto
    ) {
        UbicacionDTO actualizada = ubicacionService.actualizarUbicacion(id, dto);
        return ResponseEntity.ok(actualizada);
    }

    // ---------- DELETE ----------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ubicacionService.eliminarUbicacion(id);
        return ResponseEntity.noContent().build();
    }
}
