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

    // Crear una ubicacion
    public UbicacionDTO crearUbicacion(UbicacionDTO ubicacionDTO) {
        Ubicacion ubicacion = mapToEntity(ubicacionDTO);
        Ubicacion saved = ubicacionRepository.save(ubicacion);
        return mapToDTO(saved);
    }

    // Listar todas las ubicaciones
    public List<UbicacionDTO> listarUbicaciones() {
        return ubicacionRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Obtener Ubicacion por ID
    public UbicacionDTO obtenerUbicacionPorId(Long id) {
        Ubicacion ubicacion = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + id));
        return mapToDTO(ubicacion);
    }

    // Actualizar ubicacion
    public UbicacionDTO actualizarUbicacion(Long id, UbicacionDTO ubicacionDTO) {
        Ubicacion ubicacion = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + id));

        ubicacion.setNombre(ubicacionDTO.nombre());
        ubicacion.setDireccion(ubicacionDTO.direccion());
        ubicacion.setLocalidad(ubicacionDTO.localidad());
        ubicacion.setLatitud(ubicacionDTO.latitud());
        ubicacion.setLongitud(ubicacionDTO.longitud());

        // ✅ actualizar oasis
        Oasis oasis = resolveOasis(ubicacionDTO);
        ubicacion.setOasis(oasis);

        Ubicacion updated = ubicacionRepository.save(ubicacion);
        return mapToDTO(updated);
    }

    // Eliminar ubicacion
    public void eliminarUbicacion(Long id) {
        if (!ubicacionRepository.existsById(id)) {
            throw new RuntimeException("Ubicación no encontrada con ID: " + id);
        }
        ubicacionRepository.deleteById(id);
    }

    // Mapear entidad -> DTO
    private UbicacionDTO mapToDTO(Ubicacion ubicacion) {
        return new UbicacionDTO(
                ubicacion.getId(),
                ubicacion.getNombre(),
                ubicacion.getDireccion(),
                ubicacion.getLocalidad(),
                ubicacion.getOasis(),
                ubicacion.getLatitud(),
                ubicacion.getLongitud()
        );
    }

    public List<UbicacionDTO> filtrarPorOasis(String oasis) {
        return ubicacionRepository.findByOasis(Oasis.valueOf(oasis.toUpperCase()))
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<UbicacionDTO> filtrarPorLocalidad(String localidad) {
        return ubicacionRepository.findByLocalidad(localidad.toUpperCase())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<UbicacionDTO> filtrarPorOasisYLocalidad(String oasis, String localidad) {
        return ubicacionRepository
                .findByOasisAndLocalidad(Oasis.valueOf(oasis.toUpperCase()), localidad.toUpperCase())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ---- Helpers ----

    // ✅ Resolver oasis dando prioridad al campo 'oasis' del DTO; si no viene, deducir desde 'localidad'
    private Oasis resolveOasis(UbicacionDTO dto) {
        if (dto.oasis() != null) {
            return dto.oasis();
        }
        if (dto.localidad() != null && !dto.localidad().isBlank()) {
            try {
                Localidad localidadEnum = Localidad.valueOf(dto.localidad().toUpperCase().replace(" ", "_"));
                return localidadEnum.getOasis();
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Localidad inválida: " + dto.localidad()
                );
            }
        }
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Debe enviar 'oasis' (GRAN_MENDOZA|VALLE_DE_UCO|ZONA_ESTE|OASIS_SUR) o una 'localidad' válida"
        );
    }

    // Mapear DTO -> entidad
    private Ubicacion mapToEntity(UbicacionDTO dto) {
        Oasis oasis = resolveOasis(dto);

        Ubicacion u = new Ubicacion();
        u.setNombre(dto.nombre());
        u.setDireccion(dto.direccion());
        u.setLocalidad(dto.localidad());
        u.setOasis(oasis);
        u.setLatitud(dto.latitud());
        u.setLongitud(dto.longitud());
        return u;
    }
}
