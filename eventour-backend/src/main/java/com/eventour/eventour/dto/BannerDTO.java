package com.eventour.eventour.dto;

import com.eventour.eventour.model.BannerSlot;

public record BannerDTO(
        Long id,
        BannerSlot slot,
        String imagenUrl,
        String linkUrl,
        String alt,
        boolean activo
) {}
