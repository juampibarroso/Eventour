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

    // ------- Crear (JSON plano) -------
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> crear(@RequestBody UbicacionDTO dto) {
        // Validación mínima: exigir “oasis” (tu requirement)
        if (dto.oasis() == null) {
            return ResponseEntity.badRequest().build();
        }
        UbicacionDTO creada = ubicacionService.crearUbicacion(dto);
        return ResponseEntity.ok(creada);
    }

    // ------- Listar -------
    @GetMapping
    public ResponseEntity<List<UbicacionDTO>> listar() {
        return ResponseEntity.ok(ubicacionService.listarUbicaciones());
    }

    // ------- Obtener por ID -------
    @GetMapping("/{id}")
    public ResponseEntity<UbicacionDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionPorId(id));
    }

    // ------- Actualizar -------
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> actualizar(@PathVariable Long id,
                                                   @RequestBody UbicacionDTO dto) {
        return ResponseEntity.ok(ubicacionService.actualizarUbicacion(id, dto));
    }

    // ------- Eliminar -------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ubicacionService.eliminarUbicacion(id);
        return ResponseEntity.noContent().build();
    }
}
