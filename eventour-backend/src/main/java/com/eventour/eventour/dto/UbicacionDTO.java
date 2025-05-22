package com.eventour.eventour.dto;

public record UbicacionDTO(
        Long id,
        String nombre,
        String direccion,
        String localidad,
        Double latitud,
        Double longitud
) {
}
