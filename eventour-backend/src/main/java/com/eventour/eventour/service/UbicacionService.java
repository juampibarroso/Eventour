package com.eventour.eventour.service;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.model.Ubicacion;
import com.eventour.eventour.repository.UbicacionRepository;
import org.springframework.stereotype.Service;

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
        Ubicacion entity = toEntity(dto);
        Ubicacion saved = ubicacionRepository.save(entity);
        return toDTO(saved);
    }

    // Listar
    public List<UbicacionDTO> listarUbicaciones() {
        return ubicacionRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Obtener por id
    public UbicacionDTO obtenerUbicacionPorId(Long id) {
        Ubicacion entity = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada id=" + id));
        return toDTO(entity);
    }

    // Actualizar
    public UbicacionDTO actualizarUbicacion(Long id, UbicacionDTO dto) {
        Ubicacion entity = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada id=" + id));

        if (dto.nombre() != null) entity.setNombre(dto.nombre());
        if (dto.direccion() != null) entity.setDireccion(dto.direccion());
        if (dto.oasis() != null) entity.setOasis(dto.oasis());
        if (dto.latitud() != null) entity.setLatitud(dto.latitud());
        if (dto.longitud() != null) entity.setLongitud(dto.longitud());

        Ubicacion updated = ubicacionRepository.save(entity);
        return toDTO(updated);
    }

    // Eliminar
    public void eliminarUbicacion(Long id) {
        if (!ubicacionRepository.existsById(id)) {
            throw new RuntimeException("Ubicación no encontrada id=" + id);
        }
        ubicacionRepository.deleteById(id);
    }

    // ---------- mapping ----------
    private UbicacionDTO toDTO(Ubicacion e) {
        return new UbicacionDTO(
                e.getId(),
                e.getNombre(),
                e.getDireccion(),
                e.getOasis(),
                e.getLatitud(),
                e.getLongitud()
        );
    }

    private Ubicacion toEntity(UbicacionDTO d) {
        Ubicacion e = new Ubicacion();
        e.setNombre(d.nombre());
        e.setDireccion(d.direccion()); 
        e.setOasis(d.oasis());         // **requerido** por el controller
        e.setLatitud(d.latitud());
        e.setLongitud(d.longitud());
        return e;
    }
}
