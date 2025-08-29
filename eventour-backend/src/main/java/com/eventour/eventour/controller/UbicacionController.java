package com.eventour.eventour.controller;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.model.Oasis;
import com.eventour.eventour.service.UbicacionService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/ubicaciones", produces = MediaType.APPLICATION_JSON_VALUE)
public class UbicacionController {

    private final UbicacionService ubicacionService;
    private final ObjectMapper objectMapper;

    public UbicacionController(UbicacionService ubicacionService, ObjectMapper objectMapper) {
        this.ubicacionService = ubicacionService;
        this.objectMapper = objectMapper;
    }

    // ---------- CREAR (unico POST) ----------
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> crear(@RequestBody String body) throws Exception {
        // Parse robusto: JSON -> Map
        Map<String, Object> payload = objectMapper.readValue(body, new TypeReference<Map<String, Object>>() {});
        UbicacionDTO dto = mapPayloadToDto(payload);

        UbicacionDTO creada = ubicacionService.crearUbicacion(dto);
        return ResponseEntity.ok(creada);
    }

    // ---------- LISTAR ----------
    @GetMapping
    public ResponseEntity<List<UbicacionDTO>> listar() {
        return ResponseEntity.ok(ubicacionService.listarUbicaciones());
    }

    // ---------- OBTENER POR ID ----------
    @GetMapping("/{id}")
    public ResponseEntity<UbicacionDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionPorId(id));
    }

    // ---------- ACTUALIZAR ----------
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> actualizar(@PathVariable Long id, @RequestBody String body) throws Exception {
        Map<String, Object> payload = objectMapper.readValue(body, new TypeReference<Map<String, Object>>() {});
        UbicacionDTO dto = mapPayloadToDto(payload);
        return ResponseEntity.ok(ubicacionService.actualizarUbicacion(id, dto));
    }

    // ---------- ELIMINAR ----------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ubicacionService.eliminarUbicacion(id);
        return ResponseEntity.noContent().build();
    }

    // ===== Helpers =====
    private UbicacionDTO mapPayloadToDto(Map<String, Object> p) {
        String nombre = str(p, "nombre");
        String direccion = str(p, "direccion");
        String localidad = str(p, "localidad");

        Oasis oasis = null;
        String oasisStr = str(p, "oasis");
        if (oasisStr != null && !oasisStr.isBlank()) {
            oasis = Oasis.valueOf(oasisStr.trim().toUpperCase());
        }

        Double latitud = dbl(p, "latitud");
        Double longitud = dbl(p, "longitud");

        return new UbicacionDTO(
                null, nombre, direccion, localidad, oasis, latitud, longitud
        );
    }

    private String str(Map<String, Object> p, String k) {
        Object v = p.get(k);
        return v == null ? null : v.toString();
    }

    private Double dbl(Map<String, Object> p, String k) {
        Object v = p.get(k);
        if (v == null) return null;
        if (v instanceof Number n) return n.doubleValue();
        return Double.valueOf(v.toString());
    }
}
