import React, { useEffect, useMemo, useState } from "react";
import { API_BASE, getJson } from "../lib/api";
import "../styles/EventListPage.css";

/* ===== Helpers ===== */
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

const LABEL_CAT = {
  DEPORTESYAVENTURA: "Deportes y Aventura",
  GASTRONOMIAYVINO: "Gastronomía y Vino",
  FERIASYEXPOSICIONES: "Ferias y Exposiciones",
  MUSICAYESPECTACULOS: "Música y Espectáculos",
  ARTEYCULTURA: "Arte y Cultura",
  CHARLASYEVENTOSEMPRESARIALES: "Charlas y Eventos Empresariales",
};

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [order, setOrder] = useState("DATE_ASC"); // o DATE_DESC

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getJson(`${API_BASE}/eventos`, { auth: false });
        if (!alive) return;
        setEvents(Array.isArray(data) ? data.map(normalizeEvent) : []);
      } catch (err) {
        console.error("GET /eventos error", err);
        if (alive) setEvents([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const availableCats = useMemo(() => {
    const set = new Set(events.map((e) => e.categoria).filter(Boolean));
    return Array.from(set);
  }, [events]);

  const filtered = useMemo(() => {
    let list = [...events];
    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter((e) =>
        (`${e.titulo} ${e.descripcion}`).toLowerCase().includes(q)
      );
    }

    if (category) list = list.filter((e) => e.categoria === category);

    if (from || to) {
      const f1 = from ? new Date(from) : null;
      const f2 = to ? new Date(to) : null;
      list = list.filter((e) => {
        const start = new Date(e.fechaInicio);
        return (!f1 || start >= f1) && (!f2 || start <= f2);
      });
    }

    list.sort((a, b) => {
      const da = new Date(a.fechaInicio || a.fechaFin || "2100-01-01");
      const db = new Date(b.fechaInicio || b.fechaFin || "2100-01-01");
      return order === "DATE_ASC" ? da - db : db - da;
    });

    return list;
  }, [events, search, category, from, to, order]);

  return (
    <main className="evp-page">
      <header className="events-head">
        <h1>Todos los Eventos</h1>
        <p>Explorá y encontrá tu próxima salida.</p>
      </header>

      <section className="events-toolbar">
        <input
          className="evp-input"
          placeholder="Buscar por título o descripción…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="evp-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {availableCats.map((c) => (
            <option key={c} value={c}>
              {LABEL_CAT[c] || c}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="evp-date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="evp-date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <select
          className="evp-select"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="DATE_ASC">Fecha ↑</option>
          <option value="DATE_DESC">Fecha ↓</option>
        </select>
      </section>

      {loading ? (
        <div className="evp-state">Cargando eventos…</div>
      ) : filtered.length === 0 ? (
        <div className="evp-state">No hay eventos con ese filtro.</div>
      ) : (
        <section className="evp-grid">
          {filtered.map((e) => {
            const price =
              e.precio > 0
                ? new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  }).format(e.precio)
                : null;

            const img = e.imagen;

            return (
              <article
                key={e.id}
                className={`ev-card ${e.destacado ? "featured" : ""}`}
                onClick={() => (window.location.href = `/evento/${e.id}`)}
              >
                <div className="ev-thumb-wrap">
                  {img ? (
                    <img
                      src={img}
                      alt={e.titulo}
                      className="ev-thumb"
                      onError={(ev) => {
                        const el = ev.currentTarget;
                        if (!el.dataset.proxy && /^https?:\/\//i.test(img)) {
                          el.dataset.proxy = "1";
                          el.src = toProxyUrl(img);
                          return;
                        }
                        el.onerror = null;
                        el.src = "/assets/bannernegro-cXfYfe60.jpg";
                      }}
                    />
                  ) : (
                    <div className="ev-thumb--ph">eventour</div>
                  )}
                  {e.destacado && <span className="badge">★</span>}
                </div>

                <div className="ev-body">
                  <h3 className="ev-title">{e.titulo}</h3>
                  {e.descripcion && <p className="ev-desc">{e.descripcion}</p>}

                  <div className="ev-chips">
                    {e.fechaInicio && (
                      <span className="chip">
                        {e.fechaInicio}
                        {e.fechaFin && e.fechaFin !== e.fechaInicio
                          ? ` → ${e.fechaFin}`
                          : ""}
                      </span>
                    )}
                    {price && <span className="chip">{price}</span>}
                    {e.categoria && (
                      <span className="chip ghost">
                        {LABEL_CAT[e.categoria] || e.categoria}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
