package com.eventour.eventour.dto;

import com.eventour.eventour.model.Oasis;

public record UbicacionDTO(
        Long id,
        String nombre,
        String direccion,
        String localidad,
        Oasis oasis,
        Double latitud,
        Double longitud
) {
}
