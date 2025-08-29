package com.eventour.eventour.controller;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.service.UbicacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;



import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(
  value = "/api/ubicaciones",
  produces = MediaType.APPLICATION_JSON_VALUE
)
public class UbicacionController {

    private final UbicacionService ubicacionService;

    public UbicacionController(UbicacionService ubicacionService){
        this.ubicacionService = ubicacionService;
    }

    //crear ubicacion
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UbicacionDTO> crearUbicacion(@RequestBody UbicacionDTO ubicacionDTO){
        UbicacionDTO nuevaUbicacion = ubicacionService.crearUbicacion(ubicacionDTO);
        return ResponseEntity.ok(nuevaUbicacion);
    }

    //listar todas las ubicaciones
    @GetMapping
    public ResponseEntity<List<UbicacionDTO>> listarUbicaciones(){
        return ResponseEntity.ok(ubicacionService.listarUbicaciones());
    }

    //Obterner ubicacion por ID
    @GetMapping("/{id}")
    public ResponseEntity<UbicacionDTO> obtenerUbicacionPorId(@PathVariable Long id){
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionPorId(id));
    }

    //Actualizar Ubicacion
    @PutMapping("/{id}")
    public ResponseEntity<UbicacionDTO> actualizarUbicacion(
            @PathVariable Long id,
            @RequestBody UbicacionDTO ubicacionDTO
    ){
        return ResponseEntity.ok(ubicacionService.actualizarUbicacion(id,ubicacionDTO));
    }

    //Eliminar ubicacion
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUbicacion(@PathVariable Long id){
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


    @PostMapping(path="/_echo", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> echo(@RequestBody Map<String, Object> body) {
    System.out.println("ECHO BODY -> " + body);
    return ResponseEntity.ok(body);
}




}
