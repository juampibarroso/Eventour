package com.eventour.eventour.repository;

import com.eventour.eventour.model.BlogSpot;
import com.eventour.eventour.model.CategoriaEvento;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface BlogSpotRepository extends JpaRepository< BlogSpot, Long > {

    List<BlogSpot> findByCategoria(CategoriaEvento categoria);

    List<BlogSpot> findByTituloContainingIgnoreCase(String titulo);

    @Modifying
    @Transactional
    @Query("DELETE FROM BlogSpot b WHERE b.evento.id = :eventoId")
    void deleteByEventoId(@Param("eventoId") Long eventoId);
}
