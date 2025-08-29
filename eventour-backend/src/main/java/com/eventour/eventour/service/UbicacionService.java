package com.eventour.eventour.service;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.model.Localidad;
import com.eventour.eventour.model.Oasis;
import com.eventour.eventour.model.Ubicacion;
import com.eventour.eventour.repository.UbicacionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UbicacionService {

    private final UbicacionRepository ubicacionRepository;

    public UbicacionService(UbicacionRepository ubicacionRepository) {
        this.ubicacionRepository = ubicacionRepository;
    }

    // Crear
    public UbicacionDTO crearUbicacion(UbicacionDTO dto) {
        Ubicacion u = mapToEntity(dto);
        Ubicacion saved = ubicacionRepository.save(u);
        return mapToDTO(saved);
    }

    // Listar
    public List<UbicacionDTO> listarUbicaciones() {
        return ubicacionRepository.findAll()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // Obtener por ID
    public UbicacionDTO obtenerUbicacionPorId(Long id) {
        Ubicacion u = ubicacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ubicación no encontrada: " + id));
        return mapToDTO(u);
    }

    // Actualizar
    public UbicacionDTO actualizarUbicacion(Long id, UbicacionDTO dto) {
        Ubicacion u = ubicacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ubicación no encontrada: " + id));

        u.setNombre(dto.nombre());
        u.setDireccion(dto.direccion());
        u.setLocalidad(dto.localidad());

        Oasis oasis = resolveOasis(dto);
        u.setOasis(oasis);

        u.setLatitud(dto.latitud());
        u.setLongitud(dto.longitud());

        return mapToDTO(ubicacionRepository.save(u));
    }

    // Eliminar
    public void eliminarUbicacion(Long id) {
        if (!ubicacionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ubicación no encontrada: " + id);
        }
        ubicacionRepository.deleteById(id);
    }

    // ==== mapping ====
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

    private Ubicacion mapToEntity(UbicacionDTO dto) {
        Oasis oasis = resolveOasis(dto);

        return new Ubicacion(
                dto.nombre(),
                dto.direccion(),
                dto.localidad(),
                oasis,
                dto.latitud(),
                dto.longitud()
        );
    }

    private Oasis resolveOasis(UbicacionDTO dto) {
        if (dto.oasis() != null) {
            return dto.oasis(); // usa lo que envía el front (enum válido)
        }
        // Si NO querés deducir por localidad, descomentá la siguiente línea:
        // throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe enviar 'oasis' (GRAN_MENDOZA|VALLE_DE_UCO|ZONA_ESTE|OASIS_SUR)");

        // Si querés intentar deducir:
        if (dto.localidad() != null && !dto.localidad().isBlank()) {
            Localidad loc = Localidad.valueOf(dto.localidad().toUpperCase().replace(" ", "_"));
            return loc.getOasis();
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe enviar 'oasis' o 'localidad' válida");
    }
}
