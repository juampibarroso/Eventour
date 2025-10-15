// src/lib/media.js
const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

/** Devuelve una URL de imagen válida para un evento. */
export function getEventImageUrl(ev) {
  const raw =
    ev?.imagenUrl ??
    ev?.imageUrl ??
    ev?.imagen ??
    ev?.cover ??
    ev?.banner ??
    ev?.urlImagen ??
    "";

  // Nada: placeholder
  if (!raw || typeof raw !== "string") return placeholder();

  // Si viene data URL o blob u otra URL válida, devuelvo como está
  if (/^(data:|blob:)/i.test(raw)) return raw;

  // Si es relativa: la resuelvo contra la API (sirve para /uploads/... o uploads/...)
  if (/^(\/?uploads\/|^\/?images\/|^\/?img\/)/i.test(raw) || raw.startsWith("/")) {
    return API ? `${API.replace(/\/api$/, "")}${raw.startsWith("/") ? "" : "/"}${raw}` : raw;
  }

  // Si es http, intento forzar https para evitar mixed-content
  if (/^http:\/\//i.test(raw)) return raw.replace(/^http:\/\//i, "https://");

  // Si ya es https o URL absoluta, la devuelvo
  return raw;
}

export function placeholder() {
  // Un PNG muy liviano de gradiente oscuro (data URL) para que no parpadee
  return "data:image/svg+xml;utf8," + encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#1a1120'/>
          <stop offset='100%' stop-color='#0e0e12'/>
        </linearGradient>
      </defs>
      <rect fill='url(#g)' width='100%' height='100%'/>
      <text x='50%' y='52%' font-family='system-ui,Segoe UI,Roboto' font-size='42' fill='#b38bf6' text-anchor='middle'>eventour</text>
    </svg>
  `);
}
