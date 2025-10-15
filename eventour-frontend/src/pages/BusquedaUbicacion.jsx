import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, getJson } from "../lib/api";
import "../styles/BusquedaUbicacion.css";

/* Reutilizamos los estilos de tarjetas de la vista /events */
import "../styles/EventListPage.css";

/* ===== Normalización ubicaciones (lat/lng robusto) ===== */
const normUbi = (u) => {
  const id = u.id ?? u.ID ?? u.Id;
  const nombre = u.nombre ?? u.name ?? "";
  const direccion = u.direccion ?? u.address ?? "";

  // Acepta lat/lng o latitud/longitud o strings
  const latRaw = u.lat ?? u.latitude ?? u.latitud;
  const lngRaw = u.lng ?? u.lon ?? u.longitud ?? u.longitude;

  const lat = typeof latRaw === "number" ? latRaw : Number(latRaw);
  const lng = typeof lngRaw === "number" ? lngRaw : Number(lngRaw);

  return { id, nombre, direccion, lat: isFinite(lat) ? lat : null, lng: isFinite(lng) ? lng : null };
};

/* ===== Normalización eventos mínima ===== */
const normEvent = (r) => ({
  id: r.id,
  titulo: r.titulo ?? r.nombre ?? "Evento",
  descripcion: r.descripcion ?? r.description ?? "",
  categoria:
    (r.categoria ?? r.categoriaEvento ?? r.categoriaId ?? "")
      ? String(r.categoria ?? r.categoriaEvento ?? r.categoriaId).toUpperCase()
      : "",
  precio: Number(r.precio ?? 0) || 0,
  destacado: !!(typeof r.destacado === "number" ? r.destacado > 0 : r.destacado),
  ubicacionId: Number(r.ubicacion_id ?? r.ubicacionId ?? r.ubicacion?.id) || null,
  fechaInicio: r.fecha_inicio ?? r.fechaInicio ?? null,
  fechaFin: r.fecha_fin ?? r.fechaFin ?? null,

  // aliases de imagen
  imagen: r.imagen ?? r.imagenUrl ?? r.urlImagen ?? r.imagenPrincipal ?? "",
});

/* ===== Helpers imagen (coherentes con otras vistas) ===== */
const backendBase = API_BASE.replace(/\/api\/?$/, "");

const normalizeUrl = (raw) => {
  if (!raw || typeof raw !== "string") return null;
  let u = raw.trim();
  if (u.startsWith("//")) u = "https:" + u;
  if (!/^https?:\/\//i.test(u)) {
    return `${backendBase}${u.startsWith("/") ? u : "/" + u}`;
  }
  return u;
};

const toProxy = (absUrl) => {
  try {
    const noProto = absUrl.replace(/^https?:\/\//i, "");
    return `https://images.weserv.nl/?url=${encodeURIComponent(noProto)}&w=1024&h=576&fit=cover`;
  } catch {
    return absUrl;
  }
};

const imgSrc = (ev) => {
  const cand = [
    ev?.imagen,
    ev?.imagenUrl,
    ev?.urlImagen,
    ev?.imagenPrincipal,
    Array.isArray(ev?.imagenes) ? ev.imagenes[0] : null,
  ].filter(Boolean);
  const found = cand.find((x) => typeof x === "string" && x.trim() !== "");
  return normalizeUrl(found) || "/assets/bannernegro-cXfYfe60.jpg";
};

/* ===== Fechas/Precio ===== */
const toISO = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(+dt)) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const da = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
};

export default function BusquedaUbicacion() {
  const nav = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const [q, setQ] = useState("mendoza");
  const [ubis, setUbis] = useState([]);
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState("");

  // 1) Cargar ubicaciones y eventos
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [us, es] = await Promise.all([
          getJson(`${API_BASE}/ubicaciones`, { auth: false }),
          getJson(`${API_BASE}/eventos`, { auth: false }),
        ]);
        if (!alive) return;
        setUbis(Array.isArray(us) ? us.map(normUbi) : []);
        setEvents(Array.isArray(es) ? es.map(normEvent) : []);
      } catch (e) {
        console.error(e);
        if (alive) setErr("No se pudieron cargar ubicaciones/eventos.");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 2) Inicializar Google Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return; // ya creado

    // Centro Mendoza aprox
    const center = { lat: -32.889, lng: -68.845 };
    try {
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 11,
        mapId: "EVENTOUR_MAP",
        clickableIcons: false,
        streetViewControl: false,
        mapTypeControl: false,
      });
      mapInstance.current = map;
    } catch (e) {
      console.error("Google Maps no disponible aún:", e);
    }
  }, []);

  // 3) Join evento-ubicación
  const joined = useMemo(() => {
    const byId = new Map(ubis.map((u) => [u.id, u]));
    return events
      .map((ev) => ({ ev, ubi: byId.get(ev.ubicacionId) }))
      .filter(({ ubi }) => ubi && isFinite(ubi.lat) && isFinite(ubi.lng));
  }, [ubis, events]);

  // 4) Filtro por texto
  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase();
    if (!qn) return joined;
    return joined.filter(({ ev, ubi }) => {
      return (
        (ev.titulo || "").toLowerCase().includes(qn) ||
        (ev.descripcion || "").toLowerCase().includes(qn) ||
        (ubi.nombre || "").toLowerCase().includes(qn) ||
        (ubi.direccion || "").toLowerCase().includes(qn)
      );
    });
  }, [joined, q]);

  // 5) Marcadores en el mapa
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // limpiar marcadores previos
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (filtered.length === 0) return;

    // bounds para ajustar
    // eslint-disable-next-line no-undef
    const bounds = new google.maps.LatLngBounds();

    filtered.forEach(({ ev, ubi }) => {
      // eslint-disable-next-line no-undef
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: ubi.lat, lng: ubi.lng },
        title: ev.titulo,
      });

      marker.addListener("gmp-click", () => {
        nav(`/evento/${ev.id}`);
      });

      markersRef.current.push(marker);
      bounds.extend({ lat: ubi.lat, lng: ubi.lng });
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { top: 60, right: 40, bottom: 40, left: 40 });
    }
  }, [filtered, nav]);

  return (
    <main className="ub-page">
      <header className="ub-head">
        <h1 className="ub-title">Buscar por Ubicación</h1>

        <div className="ub-search">
          <span className="ub-pin">📍</span>
          <input
            className="ub-input"
            placeholder="Filtrar por título, descripción o lugar…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            className="df-clear"
            onClick={() => {
              setQ("");
              // re-ajustar a todos
              if (joined.length && mapInstance.current) {
                // eslint-disable-next-line no-undef
                const bounds = new google.maps.LatLngBounds();
                joined.forEach(({ ubi }) => bounds.extend({ lat: ubi.lat, lng: ubi.lng }));
                if (!bounds.isEmpty()) {
                  mapInstance.current.fitBounds(bounds, { top: 60, right: 40, bottom: 40, left: 40 });
                }
              }
            }}
          >
            Ajustar a pines
          </button>

          <button
            className="df-chip"
            onClick={() => {
              if (mapInstance.current) {
                mapInstance.current.setCenter({ lat: -32.889, lng: -68.845 });
                mapInstance.current.setZoom(11);
              }
            }}
          >
            Mendoza
          </button>
        </div>
      </header>

      <section className="ub-map-wrap" aria-label="Mapa con eventos">
        <div ref={mapRef} className="ub-map" />
      </section>

      <section className="ub-list" aria-live="polite">
        {err ? (
          <div className="ub-error">⚠️ {err}</div>
        ) : filtered.length === 0 ? (
          <div className="ub-empty">
            <span className="ub-empty-ico">🔎</span>No hay eventos para ese filtro.
          </div>
        ) : (
          /* === Grid con las MISMAS cards que /events === */
          <section className="evp-grid">
            {filtered.map(({ ev, ubi }) => {
              const primary = imgSrc(ev);
              const desde = toISO(ev.fechaInicio);
              const hasta = toISO(ev.fechaFin || ev.fechaInicio);
              const price =
                Number.isFinite(Number(ev.precio)) && Number(ev.precio) > 0
                  ? new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      maximumFractionDigits: 0,
                    }).format(Number(ev.precio))
                  : null;

              return (
                <article
                  key={`${ev.id}-${ubi.id}`}
                  className="ev-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => nav(`/evento/${ev.id}`)}
                  onKeyDown={(e) => (e.key === "Enter" ? nav(`/evento/${ev.id}`) : null)}
                >
                  <div className="ev-thumb-wrap">
                    <img
                      className="ev-thumb"
                      src={primary}
                      alt={ev.titulo || "Evento"}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const el = e.currentTarget;
                        if (!el.dataset.proxied && /^https?:\/\//i.test(primary)) {
                          el.dataset.proxied = "1";
                          el.src = toProxy(primary);
                          return;
                        }
                        el.onerror = null;
                        el.src = "/assets/bannernegro-cXfYfe60.jpg";
                      }}
                    />
                    {ev.destacado && <span className="badge">Destacado</span>}
                  </div>

                  <div className="ev-body">
                    <h3 className="ev-title">{ev.titulo}</h3>
                    {/* lugar debajo del título */}
                    <p className="ev-desc">
                      {ubi.nombre}
                      {ubi.direccion ? ` — ${ubi.direccion}` : ""}
                    </p>

                    <div className="ev-chips">
                      {desde && (
                        <span className="chip">
                          {desde}
                          {hasta && hasta !== desde ? ` → ${hasta}` : ""}
                        </span>
                      )}
                      {price && <span className="chip">{price}</span>}
                      {ev.categoria && <span className="chip ghost">{ev.categoria}</span>}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
}
