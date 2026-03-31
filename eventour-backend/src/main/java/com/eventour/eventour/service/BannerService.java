package com.eventour.eventour.service;

import com.eventour.eventour.dto.BannerDTO;
import com.eventour.eventour.model.BannerPublicidad;
import com.eventour.eventour.repository.BannerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.List;

@Service
public class BannerService {

    private static final String EVENTOUR_HOME = "https://eventour.com.ar";

    private final BannerRepository bannerRepository;

    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    public List<BannerDTO> listarBanners() {
        return bannerRepository.findAllByOrderBySlotAsc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<BannerDTO> listarBannersActivos() {
        return bannerRepository.findByActivoTrueOrderBySlotAsc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public BannerDTO guardarBanner(BannerDTO dto) {
        validarBanner(dto);

        BannerPublicidad existingBySlot = bannerRepository.findBySlot(dto.slot()).orElse(null);
        BannerPublicidad entity;

        if (dto.id() != null) {
            BannerPublicidad current = bannerRepository.findById(dto.id())
                    .orElseThrow(() -> new IllegalArgumentException("Banner no encontrado"));

            if (existingBySlot != null && !existingBySlot.getId().equals(current.getId())) {
                bannerRepository.delete(current);
                entity = existingBySlot;
            } else {
                entity = current;
            }
        } else {
            entity = existingBySlot != null ? existingBySlot : new BannerPublicidad();
        }

        entity.setSlot(dto.slot());
        entity.setImagenUrl(normalizarImagen(dto.imagenUrl()));
        entity.setLinkUrl(normalizarLink(dto.linkUrl()));
        entity.setAlt(normalizarAlt(dto.alt(), dto.slot().name()));
        entity.setActivo(dto.activo());

        return toDTO(bannerRepository.save(entity));
    }

    public void eliminarBanner(Long id) {
        if (!bannerRepository.existsById(id)) {
            throw new IllegalArgumentException("Banner no encontrado");
        }
        bannerRepository.deleteById(id);
    }

    private void validarBanner(BannerDTO dto) {
        if (dto.slot() == null) {
            throw new IllegalArgumentException("El slot del banner es obligatorio");
        }
        if (dto.imagenUrl() == null || dto.imagenUrl().isBlank()) {
            throw new IllegalArgumentException("La URL del banner es obligatoria");
        }
        if (dto.linkUrl() != null && !dto.linkUrl().isBlank()) {
            try {
                URI.create(normalizarLink(dto.linkUrl()));
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("El link del banner debe ser una URL válida");
            }
        }
    }

    private BannerDTO toDTO(BannerPublicidad entity) {
        return new BannerDTO(
                entity.getId(),
                entity.getSlot(),
                entity.getImagenUrl(),
                entity.getLinkUrl(),
                entity.getAlt(),
                entity.isActivo()
        );
    }

    private String normalizarLink(String rawLink) {
        if (rawLink == null || rawLink.isBlank()) {
            return EVENTOUR_HOME;
        }

        String link = rawLink.trim();
        if (link.startsWith("http://") || link.startsWith("https://") || link.startsWith("data:")) {
            return link;
        }
        if (link.startsWith("//")) {
            return "https:" + link;
        }
        return "https://" + link;
    }

    private String normalizarImagen(String rawImage) {
        String image = rawImage == null ? "" : rawImage.trim();
        if (image.startsWith("//")) {
            return "https:" + image;
        }
        return image;
    }

    private String normalizarAlt(String alt, String fallback) {
        if (alt == null || alt.isBlank()) {
            return "Banner " + fallback;
        }
        return alt.trim();
    }
}
