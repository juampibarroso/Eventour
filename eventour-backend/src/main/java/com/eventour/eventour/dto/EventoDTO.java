package com.eventour.eventour.dto;

import com.eventour.eventour.model.CategoriaEvento;
import com.eventour.eventour.model.Evento;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EventoDTO(
        long id,
        String titulo,
        String descripcion,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        BigDecimal precio,
        String linkEntradas,
        String imagen,
        Evento.EstadoEvento estado,
        Long ubicacionId,
        CategoriaEvento categoriaEvento,
        boolean destacado

) {
}
