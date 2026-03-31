export const OASIS_LABELS = {
  GRAN_MENDOZA: "Gran Mendoza",
  ZONA_ESTE: "Zona Este",
  VALLE_DE_UCO: "Valle de Uco",
  OASIS_SUR: "Oasis Sur",
  CHILE: "Chile",
};

export const OASIS_ORDER = [
  "GRAN_MENDOZA",
  "ZONA_ESTE",
  "VALLE_DE_UCO",
  "OASIS_SUR",
  "CHILE",
];

export const sortLocations = (locations = []) =>
  [...locations].sort((a, b) => {
    const oasisIndexA = OASIS_ORDER.indexOf(a.oasis);
    const oasisIndexB = OASIS_ORDER.indexOf(b.oasis);

    if (oasisIndexA !== oasisIndexB) {
      return (oasisIndexA === -1 ? Number.MAX_SAFE_INTEGER : oasisIndexA)
        - (oasisIndexB === -1 ? Number.MAX_SAFE_INTEGER : oasisIndexB);
    }

    return String(a.nombre || "").localeCompare(String(b.nombre || ""));
  });

export const getAvailableOases = (locations = []) =>
  Array.from(new Set(locations.map((location) => location.oasis).filter(Boolean))).sort((a, b) => {
    const oasisIndexA = OASIS_ORDER.indexOf(a);
    const oasisIndexB = OASIS_ORDER.indexOf(b);
    return (oasisIndexA === -1 ? Number.MAX_SAFE_INTEGER : oasisIndexA)
      - (oasisIndexB === -1 ? Number.MAX_SAFE_INTEGER : oasisIndexB);
  });

export const filterLocationsByOasis = (locations = [], oasis = "") =>
  sortLocations(locations).filter((location) => (oasis ? location.oasis === oasis : true));
