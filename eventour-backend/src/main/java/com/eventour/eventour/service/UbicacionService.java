package com.eventour.eventour.service;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.model.Localidad;
import com.eventour.eventour.model.Oasis;
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

    // ---------- Crear ----------
    public UbicacionDTO crearUbicacion(UbicacionDTO dto) {
        Ubicacion entity = mapToEntity(dto);
        Ubicacion saved = ubicacionRepository.save(entity);
        return mapToDTO(saved);
    }

    // ---------- Listar ----------
    public List<UbicacionDTO> listarUbicaciones() {
        return ubicacionRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ---------- Obtener por ID ----------
    public UbicacionDTO obtenerUbicacionPorId(Long id) {
        Ubicacion ubicacion = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + id));
        return mapToDTO(ubicacion);
    }

    // ---------- Actualizar ----------
    public UbicacionDTO actualizarUbicacion(Long id, UbicacionDTO dto) {
        Ubicacion ubicacion = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + id));

        // Permite actualizar nombre/dirección/localidad/lat/long y, si viene, oasis
        ubicacion.setNombre(dto.nombre());
        ubicacion.setDireccion(dto.direccion());
        ubicacion.setLocalidad(dto.localidad());
        ubicacion.setLatitud(dto.latitud());
        ubicacion.setLongitud(dto.longitud());

        Oasis oasis = dto.oasis();
        if (oasis == null && dto.localidad() != null && !dto.localidad().isBlank()) {
            Localidad locEnum = Localidad.valueOf(dto.localidad().toUpperCase().replace(" ", "_"));
            oasis = locEnum.getOasis();
        }
        if (oasis != null) {
            ubicacion.setOasis(oasis);
        }

        Ubicacion updated = ubicacionRepository.save(ubicacion);
        return mapToDTO(updated);
    }

    // ---------- Eliminar ----------
    public void eliminarUbicacion(Long id) {
        if (!ubicacionRepository.existsById(id)) {
            throw new RuntimeException("Ubicación no encontrada con ID: " + id);
        }
        ubicacionRepository.deleteById(id);
    }

    // ---------- Filtros ----------
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

    // ---------- Mapping ----------
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

    private Ubicacion mapToEntity(UbicacionDTO dto) {
        // Acepta 'oasis' directo o lo infiere desde 'localidad'
        Oasis oasis = dto.oasis();
        String localidad = dto.localidad();

        if (oasis == null && localidad != null && !localidad.isBlank()) {
            Localidad locEnum = Localidad.valueOf(localidad.toUpperCase().replace(" ", "_"));
            oasis = locEnum.getOasis();
        }

        if (oasis == null) {
            throw new IllegalArgumentException(
                "Debe enviar 'oasis' (GRAN_MENDOZA|VALLE_DE_UCO|ZONA_ESTE|OASIS_SUR) o una 'localidad' válida"
            );
        }

        return new Ubicacion(
                dto.nombre(),
                dto.direccion(),
                localidad,     // puede ser null
                oasis,
                dto.latitud(),
                dto.longitud()
        );
    }
}
