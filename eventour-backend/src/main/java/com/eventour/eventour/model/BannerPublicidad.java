package com.eventour.eventour.model;

import jakarta.persistence.*;

@Entity
@Table(name = "banners_publicitarios")
public class BannerPublicidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 32)
    private BannerSlot slot;

    @Lob
    @Column(name = "imagen_url", columnDefinition = "MEDIUMTEXT", nullable = false)
    private String imagenUrl;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(length = 255)
    private String alt;

    @Column(nullable = false)
    private boolean activo = true;

    public BannerPublicidad() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BannerSlot getSlot() {
        return slot;
    }

    public void setSlot(BannerSlot slot) {
        this.slot = slot;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    public String getAlt() {
        return alt;
    }

    public void setAlt(String alt) {
        this.alt = alt;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}
