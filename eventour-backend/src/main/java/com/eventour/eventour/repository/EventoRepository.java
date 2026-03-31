package com.eventour.eventour.repository;

import com.eventour.eventour.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {

    List<Evento> findByDestacadoTrue();

    List<Evento> findByTituloContainingIgnoreCase(String titulo);


    @Query(
            value = """
                    SELECT *
                    FROM eventos e
                    WHERE LOWER(e.titulo) LIKE LOWER(CONCAT('%', :categoria, '%'))
                       OR LOWER(CAST(e.descripcion AS CHAR(10000))) LIKE LOWER(CONCAT('%', :categoria, '%'))
                    """,
            nativeQuery = true
    )
    List<Evento> findByCategoria(@Param("categoria") String categoria);

    // Filtrar por rango de fechas
    @Query("SELECT e FROM Evento e WHERE e.fechaInicio >= :fechaInicio AND e.fechaFin <= :fechaFin")
    List<Evento> findByFechas(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

    // Filtrar por ubicación
    @Query("SELECT e FROM Evento e WHERE e.ubicacion.id = :ubicacionId")
    List<Evento> findByUbicacion(@Param("ubicacionId") Long ubicacionId);

    // Combinar filtros (opcional)
    @Query(
            value = """
                    SELECT *
                    FROM eventos e
                    WHERE (:categoria IS NULL
                           OR LOWER(e.titulo) LIKE LOWER(CONCAT('%', :categoria, '%'))
                           OR LOWER(CAST(e.descripcion AS CHAR(10000))) LIKE LOWER(CONCAT('%', :categoria, '%')))
                      AND (:fechaInicio IS NULL OR e.fecha_inicio >= :fechaInicio)
                      AND (:fechaFin IS NULL OR e.fecha_fin <= :fechaFin)
                      AND (:ubicacionId IS NULL OR e.ubicacion_id = :ubicacionId)
                    """,
            nativeQuery = true
    )
    List<Evento> findByFiltros(@Param("categoria") String categoria,
                               @Param("fechaInicio") LocalDate fechaInicio,
                               @Param("fechaFin") LocalDate fechaFin,
                               @Param("ubicacionId") Long ubicacionId);


    List<Evento> findByFechaInicioBetween(LocalDate fechaInicio, LocalDate fechaFin);

    @Query("SELECT e FROM Evento e WHERE COALESCE(e.fechaFin, e.fechaInicio) < :cutoff")
    List<Evento> findObsoletosAntesDe(@Param("cutoff") LocalDate cutoff);

}
