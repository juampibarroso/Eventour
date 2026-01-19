// src/ads/bannerConfig.js
import banner1 from "../assets/banners/banner1.png";
import banner2 from "../assets/banners/banner2.gif";
import banner3 from "../assets/banners/banner3.gif";
import banner4 from "../assets/banners/banner4.gif";

/**
 * SLOTS (ejemplo):
 * HOME_TOP_1 / HOME_TOP_2  -> bloque superior
 * HOME_MID_1 / HOME_MID_2  -> bloque del medio
 *
 * Podés cambiar links y habilitar/deshabilitar por slot.
 */
export const BANNERS_BY_SLOT = {
  HOME_TOP_1: {
    enabled: true,
    alt: "Banner 1",
    linkUrl: "https://eventour.com.ar",
    imageDesktop: banner1,
    imageMobile: banner1,
  },
  HOME_TOP_2: {
    enabled: true,
    alt: "Banner 2",
    linkUrl: "https://eventour.com.ar",
    imageDesktop: banner2,
    imageMobile: banner2,
  },
  HOME_MID_1: {
    enabled: true,
    alt: "Banner 3",
    linkUrl: "https://eventour.com.ar",
    imageDesktop: banner3,
    imageMobile: banner3,
  },
  HOME_MID_2: {
    enabled: true,
    alt: "Banner 4",
    linkUrl: "https://eventour.com.ar",
    imageDesktop: banner4,
    imageMobile: banner4,
  },
};
