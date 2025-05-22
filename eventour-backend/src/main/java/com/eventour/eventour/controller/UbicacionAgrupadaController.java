package com.eventour.eventour.controller;

import com.eventour.eventour.dto.UbicacionDTO;
import com.eventour.eventour.dto.UbicacionesAgrupadasDTO;
import com.eventour.eventour.service.UbicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ubicaciones")
public class UbicacionAgrupadaController {

    @Autowired
    private UbicacionService ubicacionService;

    private static final Map<String, List<String>> oasisMap = Map.of(
            "Valle de Uco", List.of("Tunuyán", "Tupungato", "San Carlos"),
            "Oasis Sur", List.of("San Rafael", "General Alvear", "Malargüe"),
            "Oasis Norte", List.of("Capital", "Las Heras", "Guaymallén", "Godoy Cruz"),
            "Oasis Este", List.of("San Martín", "Junín", "Rivadavia", "La Paz", "Santa Rosa")
    );


    @GetMapping("/agrupadas")
    public UbicacionesAgrupadasDTO obtenerUbicacionesAgrupadas() {
        List<UbicacionDTO> todas = ubicacionService.listarUbicaciones();
        Map<String, List<UbicacionDTO>> agrupadas = new LinkedHashMap<>();

        for (Map.Entry<String, List<String>> entry : oasisMap.entrySet()) {
            String oasis = entry.getKey();
            List<String> departamentos = entry.getValue();

            List<UbicacionDTO> filtradas = todas.stream()
                    .filter(u -> departamentos.contains(u.localidad()))
                    .collect(Collectors.toList());

            agrupadas.put(oasis, filtradas);
        }

        return new UbicacionesAgrupadasDTO(agrupadas);
    }

}
