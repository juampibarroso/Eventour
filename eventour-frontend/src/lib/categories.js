export const CATEGORY_OPTIONS = [
  { value: "GASTRONOMIAYVINO", label: "Gastronomía y Vino", icon: "🍷" },
  { value: "MUSICAYESPECTACULOS", label: "Música y Espectáculos", icon: "🎵" },
  { value: "ARTEYCULTURA", label: "Arte y Cultura", icon: "🎨" },
];

export const CATEGORY_VALUES = CATEGORY_OPTIONS.map((category) => category.value);

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORY_OPTIONS.map((category) => [category.value, category.label])
);

export const isSupportedCategory = (value) =>
  CATEGORY_VALUES.includes(String(value || "").toUpperCase());
