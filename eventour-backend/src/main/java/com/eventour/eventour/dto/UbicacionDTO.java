package com.eventour.eventour.dto;

import com.eventour.eventour.model.Oasis;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UbicacionDTO(
        Long id,
        String nombre,
        String direccion,
        String localidad,
        Oasis oasis,
        Double latitud,
        Double longitud
) {}
