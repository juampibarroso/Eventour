package com.eventour.eventour.repository;

import com.eventour.eventour.model.Oasis;
import com.eventour.eventour.model.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {
    List<Ubicacion> findByOasisAndLocalidad(Oasis oasis, String localidad);

    List<Ubicacion> findByOasis(Oasis oasis);

    List<Ubicacion> findByLocalidad(String localidad);

}
