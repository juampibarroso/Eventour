package com.eventour.eventour.controller;

import com.eventour.eventour.dto.EventoDTO;
import com.eventour.eventour.model.Evento;
import com.eventour.eventour.repository.UbicacionRepository;
import com.eventour.eventour.service.EventoService;
import com.eventour.eventour.service.UbicacionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    private final EventoService eventoService;
    private final UbicacionService ubicacionService;


    public EventoController(EventoService eventoService, UbicacionService ubicacionService){
        this.eventoService = eventoService;
        this.ubicacionService = ubicacionService;
    }


    // Listar todos los eventos
    @GetMapping
    public ResponseEntity<List<EventoDTO>> listarEventos() {
        List<EventoDTO> eventos = eventoService.listarEventos();
        return new ResponseEntity<>(eventos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> obtenerEventoPorId(@PathVariable Long id) {
        Evento evento = eventoService.obtenerEventoPorId(id);
        return ResponseEntity.ok(evento);
    }

    @PostMapping
    public ResponseEntity<Evento> crearEvento(@RequestBody EventoDTO eventoDTO){
        Evento nuevoEvento= eventoService.crearEvento(eventoDTO);
        return ResponseEntity.ok(nuevoEvento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evento> actualizarEvento(@PathVariable Long id, @RequestBody EventoDTO eventoDTO) {
        return ResponseEntity.ok(eventoService.actualizarEvento(id, eventoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Long id) {
        eventoService.eliminarEvento(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<EventoDTO>> filtrarEventos(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) Long ubicacionId
    ) {
        return ResponseEntity.ok(eventoService.filtrarEventosDTO(categoria, fechaInicio, fechaFin, ubicacionId));
    }

    @GetMapping("/destacados")
    public ResponseEntity<List<EventoDTO>> obtenerEventosDestacados() {
        return ResponseEntity.ok(eventoService.obtenerEventosDestacados());
    }


    //AGREGAR LAS BUSQUEDAS PERSONALIZADAS POR NOMBRE POR EJ.
    @GetMapping("/buscar")
    public ResponseEntity<List<EventoDTO>> buscarEventos(@RequestParam String titulo) {
        return ResponseEntity.ok(eventoService.buscarEventosPorNombre(titulo));
    }

    @GetMapping("/buscar-por-fechas")
    public List<Evento> buscarEventosPorFechas(@RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin) {
        return eventoService.buscarEventosEntreFechas(fechaInicio, fechaFin);
    }



}
