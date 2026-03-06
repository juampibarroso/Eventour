import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_BASE, getJson } from "../lib/api";
import "../styles/BusquedaCategoria.css";

/** Catálogo = exactamente los valores que guarda el backend */
const CATS = [
  { value: "ARTEYCULTURA", label: "Arte y Cultura", icon: "🎨" },
  { value: "CHARLASYEVENTOSEMPRESARIALES", label: "Charlas y Eventos Empr.", icon: "💼" },
  { value: "DEPORTESYAVENTURA", label: "Deportes y Aventura", icon: "🏃" },
  { value: "FERIASYEXPOSICIONES", label: "Ferias y Exposiciones", icon: "🧺" },
  { value: "GASTRONOMIAYVINO", label: "Gastronomía y Vino", icon: "🍷" },
  { value: "MUSICAYESPECTACULOS", label: "Música y Espectáculos", icon: "🎵" },
];

const LABEL_CAT = Object.fromEntries(CATS.map(c => [c.value, c.label]));

const toISO = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(+dt)) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const da = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
};

const normalizeEvent = (raw) => {
  const titulo = raw.titulo ?? raw.title ?? raw.nombre ?? "";
  const descripcion = raw.descripcion ?? raw.description ?? "";

  const fi = raw.fecha_inicio ?? raw.fechaInicio ?? raw.startDate ?? raw.fecha ?? null;
  const ff = raw.fecha_fin ?? raw.fechaFin ?? raw.endDate ?? raw.fecha ?? null;

  const categoria = (raw.categoria ?? raw.categoriaEvento ?? raw.category ?? "")
    ? String(raw.categoria ?? raw.categoriaEvento ?? raw.category).toUpperCase()
    : "";

  const precio = Number(raw.precio ?? 0) || 0;
  const destacado = typeof raw.destacado === "number" ? raw.destacado > 0 : !!raw.destacado;

  const imagen =
    raw.imagen ??
    raw.imagenUrl ??
    raw.urlImagen ??
    raw.imagenPrincipal ??
    raw.imageUrl ??
    "";

  return {
    id: raw.id,
    titulo,
    descripcion,
    fechaInicio: toISO(fi),
    fechaFin: toISO(ff || fi),
    categoria,
    precio,
    destacado,
    imagen,
  };
};

const toProxyUrl = (absoluteUrl) => {
  try {
    const noProto = absoluteUrl.replace(/^https?:\/\//i, "");
    return `https://images.weserv.nl/?url=${encodeURIComponent(noProto)}&w=1024&h=576&fit=cover`;
  } catch {
    return absoluteUrl;
  }
};

export default function BusquedaCategoria() {
  const [params, setParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // categoría actual en URL (si no hay, mostramos TODO)
  const currentCat = (params.get("category") || "").toUpperCase();

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        // ⚠️ Igual que en tu EventForm: SIEMPRE API_BASE
        const data = await getJson(`${API_BASE}/eventos`, { auth: false });
        if (!alive) return;
        setEvents(Array.isArray(data) ? data.map(normalizeEvent) : []);
      } catch (e) {
        console.error("GET eventos error:", e);
        if (!alive) setEvents([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = [...events];

    // si hay categoría, filtramos SOLO por esa
    if (currentCat) list = list.filter(ev => ev.categoria === currentCat);

    // filtro de texto
    const qn = q.trim().toLowerCase();
    if (qn) {
      list = list.filter(ev =>
        (`${ev.titulo} ${ev.descripcion}`).toLowerCase().includes(qn)
      );
    }

    // orden por fecha ascendente
    list.sort((a, b) => {
      const da = new Date(a.fechaInicio || a.fechaFin || "2100-01-01");
      const db = new Date(b.fechaInicio || b.fechaFin || "2100-01-01");
      return da - db;
    });

    return list;
  }, [events, currentCat, q]);

  const selectCat = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set("category", value);
    else next.delete("category");
    setParams(next, { replace: true });
  };

  return (
    <main className="catv3-page" role="main" aria-labelledby="catv3-title">
      <header className="catv3-head">
        <h1 id="catv3-title" className="catv3-title">Explorá por Categoría</h1>
        <p className="catv3-sub">Elegí una categoría y descubrí los eventos relacionados.</p>
      </header>

      {/* Categorías (grid simétrico) */}
      <section className="catv3-grid" aria-label="Categorías">
        {CATS.map((c) => {
          const active = currentCat === c.value;
          return (
            <button
              key={c.value}
              className={`catv3-card ${active ? "active" : ""}`}
              onClick={() => selectCat(c.value)}
              type="button"
            >
              <div className="catv3-icon" aria-hidden="true">{c.icon}</div>
              <div className="catv3-label">{c.label}</div>
            </button>
          );
        })}
      </section>

      {/* Buscador local (sin botón “ver todos…”) */}
      <section className="catv3-actions">
        <div className="catv3-search-wrap">
          <span className="catv3-lupa" aria-hidden>🔎</span>
          <input
            className="catv3-search"
            placeholder="Filtrar por título o descripción…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {currentCat && (
          <button className="catv3-clear" onClick={() => selectCat("")} type="button">
            Limpiar categoría
          </button>
        )}
      </section>

      {/* RESULTADOS AQUÍ ABAJO */}
      <section className="catv3-results" aria-live="polite">
        {loading ? (
          <div className="catv3-state">Cargando…</div>
        ) : filtered.length === 0 ? (
          <div className="catv3-state">
            {currentCat ? "No hay eventos para esta selección." : "No hay eventos disponibles."}
          </div>
        ) : (
          <div className="catv3-grid-events">
            {filtered.map((ev) => {
              const price =
                Number.isFinite(ev.precio) && ev.precio > 0
                  ? new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      maximumFractionDigits: 0,
                    }).format(ev.precio)
                  : null;

              const img = ev.imagen;

              return (
                <article
                  key={ev.id}
                  className={`catv3-ev-card ${ev.destacado ? "featured" : ""}`}
                  onClick={() => (window.location.href = `/evento/${ev.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" ? (window.location.href = `/evento/${ev.id}`) : null)}
                >
                  <div className="catv3-ev-media">
                    {img ? (
                      <img
                        src={img}
                        alt={ev.titulo || "Evento"}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const el = e.currentTarget;
                          if (!el.dataset.proxied && /^https?:\/\//i.test(img)) {
                            el.dataset.proxied = "1";
                            el.src = toProxyUrl(img);
                            return;
                          }
                          el.onerror = null;
                          el.src = "/assets/bannernegro-cXfYfe60.jpg";
                        }}
                      />
                    ) : (
                      <div className="catv3-ev-ph">eventour</div>
                    )}
                    {ev.destacado && <span className="catv3-badge">★ Destacado</span>}
                  </div>

                  <div className="catv3-ev-body">
                    <h3 className="catv3-ev-title">{ev.titulo}</h3>
                    {ev.descripcion && <p className="catv3-ev-desc">{ev.descripcion}</p>}

                    <div className="catv3-ev-meta">
                      {ev.fechaInicio && (
                        <span className="catv3-chip">
                          {ev.fechaInicio}
                          {ev.fechaFin && ev.fechaFin !== ev.fechaInicio ? ` → ${ev.fechaFin}` : ""}
                        </span>
                      )}
                      {price && <span className="catv3-chip">{price}</span>}
                      {ev.categoria && (
                        <span className="catv3-chip ghost">{LABEL_CAT[ev.categoria] || ev.categoria}</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
