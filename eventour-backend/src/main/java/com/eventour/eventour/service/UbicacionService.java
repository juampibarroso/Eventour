package com.eventour.eventour.service;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.model.Oasis;
import com.eventour.eventour.model.Ubicacion;
import com.eventour.eventour.repository.UbicacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UbicacionService {

    private final UbicacionRepository ubicacionRepository;

    public UbicacionService(UbicacionRepository ubicacionRepository) {
        this.ubicacionRepository = ubicacionRepository;
    }

    // ---------- Crear desde Map (robusto) ----------
    public UbicacionDTO crearDesdeMapa(Map<String, Object> body) {
        Ubicacion entity = mapFromMap(body, new Ubicacion());
        Ubicacion saved = ubicacionRepository.save(entity);
        return mapToDTO(saved);
    }

    // ---------- Actualizar desde Map (robusto) ----------
    public UbicacionDTO actualizarDesdeMapa(Long id, Map<String, Object> body) {
        Ubicacion entity = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + id));
        mapFromMap(body, entity);
        Ubicacion saved = ubicacionRepository.save(entity);
        return mapToDTO(saved);
    }

    // ---------- Helpers de mapeo ----------
    private Ubicacion mapFromMap(Map<String, Object> body, Ubicacion target) {
        String nombre    = asString(body.get("nombre"));
        String direccion = asString(body.get("direccion"));
        String localidad = asString(body.get("localidad")); // opcional
        String oasisStr  = asString(body.get("oasis"));
        Double latitud   = asDouble(body.get("latitud"));
        Double longitud  = asDouble(body.get("longitud"));

        if (oasisStr == null || oasisStr.isBlank()) {
            throw new IllegalArgumentException("Debe enviar 'oasis' (GRAN_MENDOZA|VALLE_DE_UCO|ZONA_ESTE|OASIS_SUR).");
        }

        Oasis oasis;
        try {
            oasis = Oasis.valueOf(oasisStr.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "Valor de 'oasis' inválido: " + oasisStr +
                    ". Use GRAN_MENDOZA|VALLE_DE_UCO|ZONA_ESTE|OASIS_SUR."
            );
        }

        target.setNombre(nombre);
        target.setDireccion(direccion);
        target.setLocalidad(localidad);
        target.setOasis(oasis);
        target.setLatitud(latitud);
        target.setLongitud(longitud);

        return target;
    }

    private static String asString(Object v) {
        return v == null ? null : String.valueOf(v).trim();
    }

    private static Double asDouble(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return n.doubleValue();
        return Double.valueOf(String.valueOf(v));
    }

    // ---------- Resto de operaciones ----------
    public List<UbicacionDTO> listarUbicaciones() {
        return ubicacionRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UbicacionDTO obtenerUbicacionPorId(Long id) {
        Ubicacion u = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + id));
        return mapToDTO(u);
    }

    public void eliminarUbicacion(Long id) {
        if (!ubicacionRepository.existsById(id)) {
            throw new RuntimeException("Ubicación no encontrada con ID: " + id);
        }
        ubicacionRepository.deleteById(id);
    }

    private UbicacionDTO mapToDTO(Ubicacion u) {
        return new UbicacionDTO(
                u.getId(),
                u.getNombre(),
                u.getDireccion(),
                u.getLocalidad(),
                u.getOasis(),
                u.getLatitud(),
                u.getLongitud()
        );
    }
}
