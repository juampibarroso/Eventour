package com.eventour.eventour.controller;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.service.UbicacionService;
import jakarta.servlet.http.HttpServletRequest;
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

    // crear ubicacion
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> crear(HttpServletRequest request, @RequestBody UbicacionDTO dto) {
        System.out.println("=== CONTROLLER DEBUG ===");
        System.out.println("Content-Type recibido: " + request.getContentType());
        System.out.println("Content-Length recibido: " + request.getContentLength());
        System.out.println("DTO recibido: " + dto);
        System.out.println("========================");
    UbicacionDTO nueva = ubicacionService.crearUbicacion(dto);
    return ResponseEntity.ok(nueva);
    }

    // listar
    @GetMapping
    public ResponseEntity<List<UbicacionDTO>> listar() {
        return ResponseEntity.ok(ubicacionService.listarUbicaciones());
    }

    // obtener por id
    @GetMapping("/{id}")
    public ResponseEntity<UbicacionDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionPorId(id));
    }

    // actualizar
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> actualizar(@PathVariable Long id, @RequestBody UbicacionDTO dto) {
        return ResponseEntity.ok(ubicacionService.actualizarUbicacion(id, dto));
    }

    // eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ubicacionService.eliminarUbicacion(id);
        return ResponseEntity.noContent().build();
    }
}
