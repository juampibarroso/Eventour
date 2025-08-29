package com.eventour.eventour.controller;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.model.Oasis;
import com.eventour.eventour.service.UbicacionService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.io.BufferedReader;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/ubicaciones", produces = MediaType.APPLICATION_JSON_VALUE)
public class UbicacionController {

    private final UbicacionService ubicacionService;

    public UbicacionController(UbicacionService ubicacionService) {
        this.ubicacionService = ubicacionService;

    }

    // --------- PROBE: leer body crudo en esta ruta exacta -----------
    @PostMapping("/_probe")
    public ResponseEntity<String> probe(HttpServletRequest request) throws Exception {
        String body;
        try (BufferedReader br = request.getReader()) {
            body = br.lines().collect(Collectors.joining("\n"));
        }
        String ct = request.getContentType();
        return ResponseEntity.ok("len=" + body.length() + " | ct=" + ct + " | body=" + body);
    }

    @PostMapping("/_create")
    public ResponseEntity<UbicacionDTO> crearDesdeMap(@RequestBody Map<String, Object> payload) {
        String nombre = (String) payload.get("nombre");
        String direccion = (String) payload.get("direccion");
        String localidad = payload.get("localidad") == null ? null : payload.get("localidad").toString();

        // convertir oasis String -> enum
        Oasis oasis = null;
        if (payload.get("oasis") != null) {
            oasis = Oasis.valueOf(payload.get("oasis").toString().toUpperCase());
        }

        Double latitud = payload.get("latitud") == null ? null : Double.valueOf(payload.get("latitud").toString());
        Double longitud = payload.get("longitud") == null ? null : Double.valueOf(payload.get("longitud").toString());

        UbicacionDTO dto = new UbicacionDTO(
                null,
                nombre,
                direccion,
                localidad,
                oasis, // ✅ ahora sí enviamos el enum
                latitud,
                longitud);

        UbicacionDTO nueva = ubicacionService.crearUbicacion(dto);
        return ResponseEntity.ok(nueva);
    }

    // crear ubicacion
    @PostMapping
    public ResponseEntity<UbicacionDTO> crearUbicacion(@RequestBody UbicacionDTO ubicacionDTO) {
        UbicacionDTO nuevaUbicacion = ubicacionService.crearUbicacion(ubicacionDTO);
        return ResponseEntity.ok(nuevaUbicacion);
    }

    // listar todas las ubicaciones
    @GetMapping
    public ResponseEntity<List<UbicacionDTO>> listarUbicaciones() {
        return ResponseEntity.ok(ubicacionService.listarUbicaciones());
    }

    // Obterner ubicacion por ID
    @GetMapping("/{id}")
    public ResponseEntity<UbicacionDTO> obtenerUbicacionPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionPorId(id));
    }

    // Actualizar Ubicacion
    @PutMapping("/{id}")
    public ResponseEntity<UbicacionDTO> actualizarUbicacion(
            @PathVariable Long id,
            @RequestBody UbicacionDTO ubicacionDTO) {
        return ResponseEntity.ok(ubicacionService.actualizarUbicacion(id, ubicacionDTO));
    }

    // Eliminar ubicacion
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUbicacion(@PathVariable Long id) {
        ubicacionService.eliminarUbicacion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filtrar/oasis")
    public ResponseEntity<List<UbicacionDTO>> filtrarPorOasis(@RequestParam String oasis) {
        return ResponseEntity.ok(ubicacionService.filtrarPorOasis(oasis));
    }

    @GetMapping("/filtrar/localidad")
    public ResponseEntity<List<UbicacionDTO>> filtrarPorLocalidad(@RequestParam String localidad) {
        return ResponseEntity.ok(ubicacionService.filtrarPorLocalidad(localidad));
    }

    @PostMapping(path = "/_echo", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> echo(@RequestBody Map<String, Object> body) {
        System.out.println("ECHO BODY -> " + body);
        return ResponseEntity.ok(body);
    }

}
