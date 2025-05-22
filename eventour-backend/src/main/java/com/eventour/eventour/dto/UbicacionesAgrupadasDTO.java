package com.eventour.eventour.dto;

import java.util.List;
import java.util.Map;

public record UbicacionesAgrupadasDTO(
        Map<String, List<UbicacionDTO>> ubicacionesPorOasis
) {
}
