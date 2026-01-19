// src/ads/BannerSlot.jsx
import React, { useMemo } from "react";
import "../styles/Banners.css";
import { BANNERS_BY_SLOT } from "./bannerConfig";

/**
 * BannerSlot
 * - Renderiza un banner por "slot".
 * - Si no existe o está disabled, muestra placeholder (como tus recuadros).
 * - Usa <picture> para desktop/mobile.
 */
export default function BannerSlot({ slot, className = "", placeholder = true }) {
  const banner = useMemo(() => BANNERS_BY_SLOT?.[slot] ?? null, [slot]);

  if (!banner || banner.enabled === false) {
    return placeholder ? (
      <div
        className={`banner-slot banner-slot--empty ${className}`.trim()}
        data-slot={slot}
        aria-hidden="true"
      />
    ) : null;
  }

  const href = banner.linkUrl || "#";
  const alt = banner.alt || "Banner";
  const desktopSrc = banner.imageDesktop;
  const mobileSrc = banner.imageMobile || banner.imageDesktop;

  return (
    <div className={`banner-slot ${className}`.trim()} data-slot={slot}>
      <a
        className="banner-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={alt}
      >
        <picture>
          {desktopSrc ? <source media="(min-width: 768px)" srcSet={desktopSrc} /> : null}
          <img className="banner-img" src={mobileSrc} alt={alt} loading="lazy" />
        </picture>
      </a>
    </div>
  );
}
