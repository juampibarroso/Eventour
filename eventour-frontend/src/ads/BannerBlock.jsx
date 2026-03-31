// src/ads/BannerBlock.jsx
import PropTypes from "prop-types";
import BannerSlot from "./BannerSlot";

/**
 * BannerBlock
 * Renderiza una lista de slots (2 banners uno abajo del otro).
 */
export default function BannerBlock({
  slots = [],
  className = "",
  placeholder = true,
  bannerMap,
}) {
  return (
    <div className={`banner-block ${className}`.trim()}>
      {slots.map((slot) => (
        <BannerSlot key={slot} slot={slot} placeholder={placeholder} bannerMap={bannerMap} />
      ))}
    </div>
  );
}

BannerBlock.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  placeholder: PropTypes.bool,
  bannerMap: PropTypes.object,
};
