// src/ads/BannerBlock.jsx
import React from "react";
import BannerSlot from "./BannerSlot";

/**
 * BannerBlock
 * Renderiza una lista de slots (2 banners uno abajo del otro).
 */
export default function BannerBlock({
  slots = [],
  className = "",
  placeholder = true,
}) {
  return (
    <div className={`banner-block ${className}`.trim()}>
      {slots.map((slot) => (
        <BannerSlot key={slot} slot={slot} placeholder={placeholder} />
      ))}
    </div>
  );
}
