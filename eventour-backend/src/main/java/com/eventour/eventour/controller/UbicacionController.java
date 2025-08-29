package com.eventour.eventour.controller;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.model.Oasis;
import com.eventour.eventour.service.UbicacionService;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ubicaciones")
public class UbicacionController {

    private final UbicacionService ubicacionService;
    private final ObjectMapper objectMapper;

    public UbicacionController(UbicacionService ubicacionService, ObjectMapper objectMapper) {
        this.ubicacionService = ubicacionService;
        this.objectMapper = objectMapper;
    }

    // ---------- Utilidades de diagnóstico ----------
    @PostMapping("/_probe")
    public ResponseEntity<String> probe(HttpServletRequest request) throws Exception {
        String body;
        try (BufferedReader br = request.getReader()) {
            body = br.lines().collect(Collectors.joining("\n"));
        }
        String ct = request.getContentType();
        return ResponseEntity.ok("len=" + body.length() + " | ct=" + ct + " | body=" + body);
    }

    @PostMapping(path = "/_echo", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> echo(@RequestBody Map<String, Object> body) {
        System.out.println("ECHO BODY -> " + body);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/_createRaw")
    public ResponseEntity<UbicacionDTO> crearDesdeRaw(@RequestBody String body) throws Exception {
        Map<String, Object> payload = objectMapper.readValue(body, new TypeReference<Map<String, Object>>() {});
        UbicacionDTO dto = mapPayloadToDto(payload);
        UbicacionDTO nueva = ubicacionService.crearUbicacion(dto);
        return ResponseEntity.ok(nueva);
    }

    // ---------- Endpoint real ----------
    @PostMapping
    public ResponseEntity<UbicacionDTO> crearUbicacion(@RequestBody String body) throws Exception {
        Map<String, Object> payload = objectMapper.readValue(body, new TypeReference<Map<String, Object>>() {});
        UbicacionDTO dto = mapPayloadToDto(payload);
        UbicacionDTO nueva = ubicacionService.crearUbicacion(dto);
        return ResponseEntity.ok(nueva);
    }

    // ---------- Lectura ----------
    @GetMapping
    public ResponseEntity<List<UbicacionDTO>> listarUbicaciones() {
        return ResponseEntity.ok(ubicacionService.listarUbicaciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UbicacionDTO> obtenerUbicacionPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionPorId(id));
    }

    // ---------- Actualización ----------
    @PutMapping("/{id}")
    public ResponseEntity<UbicacionDTO> actualizarUbicacion(@PathVariable Long id,
                                                            @RequestBody UbicacionDTO ubicacionDTO) {
        return ResponseEntity.ok(ubicacionService.actualizarUbicacion(id, ubicacionDTO));
    }

    // ---------- Eliminación ----------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUbicacion(@PathVariable Long id) {
        ubicacionService.eliminarUbicacion(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Filtros ----------
    @GetMapping("/filtrar/oasis")
    public ResponseEntity<List<UbicacionDTO>> filtrarPorOasis(@RequestParam String oasis) {
        return ResponseEntity.ok(ubicacionService.filtrarPorOasis(oasis));
    }

    @GetMapping("/filtrar/localidad")
    public ResponseEntity<List<UbicacionDTO>> filtrarPorLocalidad(@RequestParam String localidad) {
        return ResponseEntity.ok(ubicacionService.filtrarPorLocalidad(localidad));
    }

    // ---------- Helpers de mapeo ----------
    private UbicacionDTO mapPayloadToDto(Map<String, Object> payload) {
        String nombre     = getStr(payload, "nombre");
        String direccion  = getStr(payload, "direccion");
        String localidad  = getStr(payload, "localidad");

        Oasis oasis = null;
        String oasisStr = getStr(payload, "oasis");
        if (oasisStr != null && !oasisStr.isBlank()) {
            oasis = Oasis.valueOf(oasisStr.toUpperCase());
        }

        Double latitud  = getDouble(payload, "latitud");
        Double longitud = getDouble(payload, "longitud");

        return new UbicacionDTO(null, nombre, direccion, localidad, oasis, latitud, longitud);
    }

    private String getStr(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v == null ? null : v.toString();
    }

    private Double getDouble(Map<String, Object> map, String key) {
        Object v = map.get(key);
        if (v == null) return null;
        if (v instanceof Number n) return n.doubleValue();
        return Double.valueOf(v.toString());
    }
}
