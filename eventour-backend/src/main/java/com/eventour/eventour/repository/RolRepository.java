package com.eventour.eventour.repository;

import com.eventour.eventour.model.NombreRol;
import com.eventour.eventour.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol,Long> {
    Optional<Rol> findByNombre(NombreRol nombre);
}
