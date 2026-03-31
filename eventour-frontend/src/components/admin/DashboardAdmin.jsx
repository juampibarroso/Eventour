// src/components/admin/DashboardAdmin.jsx
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { API_BASE, getJson, del } from "../../lib/api";
import { formatDisplayDate, getTicketUrl } from "../../lib/eventDisplay";
import UbicacionForm from "./UbicacionForm";
import EventForm from "./EventForm";
import BannerAdmin from "./BannerAdmin";
import "../../styles/Admin.css";

export default function DashboardAdmin({ onLogout }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const data = await getJson(`${API_BASE}/eventos`, { auth: false });
      setEventos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("GET eventos error:", e);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEventos(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar evento?")) return;
    try {
      await del(`${API_BASE}/eventos/${id}`, { auth: true });
      fetchEventos();
    } catch (e) {
      console.error("DELETE evento error:", e);
      alert("❌ No se pudo eliminar.");
    }
  };

  // ===== Helpers imagen =====
  const backendBase = (() => {
    try { return (API_BASE || "/api").replace(/\/api\/?$/i, ""); } catch { return ""; }
  })();

  const sameHost = (url) => {
    try {
      const t = new URL(url, window.location.origin);
      const front = new URL(window.location.origin).host;
      const back = backendBase ? new URL(backendBase, window.location.origin).host : null;
      return t.host === front || (back && t.host === back);
    } catch { return false; }
  };

  const normalizeUrl = (raw) => {
    if (!raw || typeof raw !== "string") return null;
    let u = raw.trim();
    if (u.startsWith("//")) u = "https:" + u;
    if (/^https?:\/\//i.test(u) || u.startsWith("data:")) return u;
    const base = backendBase || window.location.origin;
    return `${base}${u.startsWith("/") ? u : "/" + u}`;
  };

  const toProxy = (absUrl) => {
    try {
      const noProto = absUrl.replace(/^https?:\/\//i, "");
      return `https://images.weserv.nl/?url=${encodeURIComponent(noProto)}&w=1024&h=576&fit=cover`;
    } catch { return absUrl; }
  };

  const filteredEventos = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return eventos;

    return eventos.filter((ev) => {
      const haystack = [
        ev?.titulo,
        ev?.descripcion,
        ev?.categoria,
        ev?.ubicacion?.nombre,
        ev?.ubicacion?.direccion,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [eventos, search]);

  const imgSrc = (ev) => {
    // probamos MUCHOS aliases
    const candidatos = [
      ev?.imagen,
      ev?.imagenUrl,
      ev?.urlImagen,
      ev?.imagenPrincipal,
      ev?.imageUrl,
      ev?.imagenURL,
      ev?.img,
      ev?.image,
      Array.isArray(ev?.imagenes) ? ev.imagenes[0] : null,
    ].filter(Boolean);

    const elegido = candidatos.find((x) => typeof x === "string" && x.trim() !== "");
    const normalizada = normalizeUrl(elegido);

    if (!normalizada) {
      // ayuda para debug: mira qué trae el evento
      console.debug("Evento sin campo de imagen reconocible:", ev);
    }
    return normalizada || "/assets/bannernegro-cXfYfe60.jpg";
  };
  // ==========================

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <button className="logout-button" onClick={onLogout}>Cerrar sesión</button>
      </div>

      <section className="admin-section admin-card">
        <div className="admin-section-head">
          <div>
            <h2>Ubicaciones</h2>
            <p className="admin-section-copy">Gestioná el mapa de lugares sin ocupar todo el panel.</p>
          </div>
        </div>
        <UbicacionForm />
      </section>

      <section className="admin-section admin-card">
        <div className="admin-section-head">
          <div>
            <h2>Cargar Evento</h2>
          </div>
        </div>
        <EventForm onSaved={fetchEventos} />
      </section>

      <section className="admin-section admin-card">
        <div className="admin-section-head">
          <div>
            <h2>Banners publicitarios</h2>
            <p className="admin-section-copy">Cargá y cambiá los auspiciantes desde el panel sin tocar el código.</p>
          </div>
        </div>
        <BannerAdmin />
      </section>

      <section className="admin-section admin-card">
        <div className="admin-section-head">
          <div>
            <h2>Eventos cargados</h2>
            <p className="admin-section-copy">Buscá rápido por nombre y revisá lo publicado en un solo vistazo.</p>
          </div>
          <button className="btn-secondary" onClick={fetchEventos} disabled={loading}>
            {loading ? "Actualizando…" : "Refrescar"}
          </button>
        </div>

        <div className="admin-events-toolbar">
          <input
            className="admin-events-search"
            type="search"
            placeholder="Buscar evento por nombre, descripción o categoría"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="admin-events-count">{filteredEventos.length} de {eventos.length} visibles</span>
        </div>

        {eventos.length === 0 && <p className="no-eventos">No hay eventos.</p>}
        {eventos.length > 0 && filteredEventos.length === 0 && (
          <p className="no-eventos">No hay eventos que coincidan con esa búsqueda.</p>
        )}

        <div className="event-grid">
          {filteredEventos.map((ev) => {
            const primary = imgSrc(ev);
            const isExternal = /^https?:\/\//i.test(primary) && !sameHost(primary);
            const ticketUrl = getTicketUrl(ev);
            return (
              <article className="event-card" key={ev.id}>
                <div className="event-card-media">
                  <img
                    src={primary}
                    alt={ev.titulo || "eventour"}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.dataset.proxied === "1" || !isExternal) {
                        el.onerror = null;
                        el.src = "/assets/bannernegro-cXfYfe60.jpg";
                        return;
                      }
                      el.dataset.proxied = "1";
                      el.src = toProxy(primary);
                    }}
                  />
                  {ev.destacado && <span className="badge">Destacado</span>}
                </div>

                <div className="event-card-body">
                  <h3 className="event-title">{ev.titulo}</h3>
                  {ev.descripcion && <p className="event-desc">{ev.descripcion}</p>}

                  {ticketUrl && (
                    <div className="event-card-links">
                      <a
                        className="admin-ticket-link"
                        href={ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver entradas
                      </a>
                    </div>
                  )}

                  <div className="event-meta">
                    {ev.fechaInicio && (
                      <span className="chip">{formatDisplayDate(ev.fechaInicio)}</span>
                    )}
                    {ev.categoria && <span className="chip ghost">{ev.categoria}</span>}
                  </div>

                  <div className="event-actions">
                    <button className="btn-danger" onClick={() => handleDelete(ev.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

DashboardAdmin.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
