package com.eventour.eventour.dto;

public record UbicacionDTO(
        Long id,
        String nombre,
        String direccion,
        String localidad,
        String oasis,
        Double latitud,
        Double longitud
) {
}
