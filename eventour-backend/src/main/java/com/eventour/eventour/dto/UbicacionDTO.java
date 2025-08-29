package com.eventour.eventour.dto;

import com.eventour.eventour.model.Oasis;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UbicacionDTO(
        Long id,
        String nombre,
        String direccion,
        String localidad,   // opcional; si lo usas, mantenlo
        Oasis oasis,        // GRAN_MENDOZA | VALLE_DE_UCO | ZONA_ESTE | OASIS_SUR
        Double latitud,
        Double longitud
) {}
