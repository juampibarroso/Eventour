package com.eventour.eventour.controller;

import com.eventour.eventour.dto.BannerDTO;
import com.eventour.eventour.service.BannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public ResponseEntity<List<BannerDTO>> listarBanners() {
        return ResponseEntity.ok(bannerService.listarBanners());
    }

    @GetMapping("/public")
    public ResponseEntity<List<BannerDTO>> listarBannersPublicos() {
        return ResponseEntity.ok(bannerService.listarBannersActivos());
    }

    @PostMapping
    public ResponseEntity<BannerDTO> guardarBanner(@RequestBody BannerDTO dto) {
        return ResponseEntity.ok(bannerService.guardarBanner(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarBanner(@PathVariable Long id) {
        bannerService.eliminarBanner(id);
        return ResponseEntity.noContent().build();
    }
}
