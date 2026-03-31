import { BANNERS_BY_SLOT } from "../ads/bannerConfig";

export const DEFAULT_BANNER_LINK = "https://eventour.com.ar";

export const BANNER_SLOT_LABELS = {
  HOME_TOP_1: "Home superior 1",
  HOME_TOP_2: "Home superior 2",
  HOME_MID_1: "Home intermedio 1",
  HOME_MID_2: "Home intermedio 2",
};

export const BANNER_SLOT_OPTIONS = Object.entries(BANNER_SLOT_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function normalizeBannerLink(rawLink) {
  if (!rawLink || typeof rawLink !== "string") return DEFAULT_BANNER_LINK;

  const link = rawLink.trim();
  if (!link) return DEFAULT_BANNER_LINK;
  if (link.startsWith("http://") || link.startsWith("https://") || link.startsWith("data:")) {
    return link;
  }
  if (link.startsWith("//")) {
    return `https:${link}`;
  }
  return `https://${link}`;
}

export function buildBannerMap(items = []) {
  const dynamicMap = {};

  items.forEach((item) => {
    if (!item?.slot || !item?.imagenUrl) return;

    dynamicMap[item.slot] = {
      id: item.id ?? null,
      enabled: item.activo !== false,
      alt: item.alt || BANNER_SLOT_LABELS[item.slot] || "Banner",
      linkUrl: normalizeBannerLink(item.linkUrl),
      imageDesktop: item.imagenUrl,
      imageMobile: item.imagenUrl,
    };
  });

  return {
    ...BANNERS_BY_SLOT,
    ...dynamicMap,
  };
}
