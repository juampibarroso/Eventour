package com.eventour.eventour.repository;

import com.eventour.eventour.model.BannerPublicidad;
import com.eventour.eventour.model.BannerSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BannerRepository extends JpaRepository<BannerPublicidad, Long> {
    List<BannerPublicidad> findAllByOrderBySlotAsc();
    List<BannerPublicidad> findByActivoTrueOrderBySlotAsc();
    Optional<BannerPublicidad> findBySlot(BannerSlot slot);
}
