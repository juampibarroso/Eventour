// src/pages/EventDetailPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE, getJson } from "../lib/api";
import { CATEGORY_LABELS } from "../lib/categories";
import { formatDisplayDate, getTicketUrl } from "../lib/eventDisplay";
import { OASIS_LABELS } from "../lib/locations";
import "../styles/EventDetail.css";

const backendBaseFromApi = (apiBase) => apiBase.replace(/\/api\/?$/i, "");

const normalizeUrl = (raw, backendBase) => {
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
    // hero más alto para detalle
    return `https://images.weserv.nl/?url=${encodeURIComponent(noProto)}&w=1600&h=680&fit=cover`;
  } catch {
    return absUrl;
  }
};

const pickImage = (ev, backendBase) => {
  const candidatos = [
    ev?.imagen,
    ev?.imagenUrl,
    ev?.urlImagen,
    ev?.imagenPrincipal,
    Array.isArray(ev?.imagenes) ? ev.imagenes[0] : null,
  ].filter(Boolean);
  const found = candidatos.find((x) => typeof x === "string" && x.trim() !== "");
  return normalizeUrl(found, backendBase) || "/assets/bannernegro-cXfYfe60.jpg";
};

const normalizeCoord = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getLocationPreview = (event) => {
  const ubicacion = event?.ubicacion ?? {};
  const nombre = ubicacion?.nombre || event?.ubicacionTexto || "";
  const direccion = ubicacion?.direccion || "";
  const oasis = ubicacion?.oasis || "";
  const lat = normalizeCoord(ubicacion?.latitud ?? ubicacion?.lat);
  const lng = normalizeCoord(ubicacion?.longitud ?? ubicacion?.lng);

  return {
    nombre,
    direccion,
    oasis,
    lat,
    lng,
  };
};

const getMapQuery = ({ nombre, direccion, lat, lng }) => {
  if (lat != null && lng != null) return `${lat},${lng}`;
  return [nombre, direccion].filter(Boolean).join(", ");
};

const buildMapEmbedUrl = (location) => {
  const query = getMapQuery(location);
  return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed` : null;
};

const buildExternalMapUrl = (location) => {
  const query = getMapQuery(location);
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
};

/* ------- componente ------- */
export default function EventDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [ev, setEv] = useState(null);
  const [err, setErr] = useState("");
  const backendBase = backendBaseFromApi(API_BASE);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getJson(`${API_BASE}/eventos/${id}`, { auth: false });
        if (alive) setEv(data);
      } catch (e) {
        console.error("GET /eventos/:id error", e);
        if (alive) setErr("No se pudo cargar el evento.");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (err) {
    return (
      <main className="evd-page">
        <div className="evd-spacer" aria-hidden />
        <div className="evd-wrap"><p className="evd-state">{err}</p></div>
      </main>
    );
  }
  if (!ev) {
    return (
      <main className="evd-page">
        <div className="evd-spacer" aria-hidden />
        <div className="evd-wrap"><p className="evd-state">Cargando…</p></div>
      </main>
    );
  }

  const fechaInicio = formatDisplayDate(ev.fechaInicio);
  const ticketUrl = getTicketUrl(ev);
  const primary = pickImage(ev, backendBase);
  const locationPreview = getLocationPreview(ev);
  const mapEmbedUrl = buildMapEmbedUrl(locationPreview);
  const mapExternalUrl = buildExternalMapUrl(locationPreview);
  const categoryLabel = CATEGORY_LABELS[ev.categoria] || ev.categoria;
  const oasisLabel = OASIS_LABELS[locationPreview.oasis] || locationPreview.oasis;
  const showMapSection = Boolean(mapEmbedUrl || locationPreview.nombre);
  const showLocationRow = Boolean(locationPreview.nombre) && !showMapSection;
  const hasPrimaryActions = Boolean(ticketUrl);

  return (
    <main className="evd-page">
      {/* deja todo por debajo de la navbar fija */}
      <div className="evd-spacer" aria-hidden />

      {/* HERO */}
      <div className="evd-hero">
        <img
          src={primary}
          alt={ev.titulo || "Evento"}
          loading="eager"
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
      </div>

      <div className="evd-wrap">
        <div className="evd-shell">
          <section className="evd-main-card">
            <div className="evd-meta">
              {fechaInicio && <span className="evd-chip">Fecha: {fechaInicio}</span>}
              {ev.categoria && <span className="evd-chip ghost">{categoryLabel}</span>}
              {locationPreview.oasis && <span className="evd-chip ghost">{oasisLabel}</span>}
            </div>

            <h1 className="evd-title">{ev.titulo || "Evento"}</h1>
            {ev.descripcion && (
              <div className="evd-desc-shell">
                <p className="evd-desc">{ev.descripcion}</p>
              </div>
            )}

            {hasPrimaryActions && (
              <div className="evd-action-bar">
                {ticketUrl && (
                  <a
                    className="evd-ticket-action"
                    href={ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Comprar entradas
                  </a>
                )}
              </div>
            )}

            <div className={`evd-info ${showLocationRow ? "" : "evd-info-single"}`.trim()}>
              {fechaInicio && (
                <div className="evd-row">
                  <div className="evd-key">Fecha</div>
                  <div className="evd-val">{fechaInicio}</div>
                </div>
              )}
              {showLocationRow && (
                <div className="evd-row">
                  <div className="evd-key">Ubicación</div>
                  <div className="evd-val">
                    <strong>{locationPreview.nombre}</strong>
                    {locationPreview.direccion && (
                      <span className="evd-subval">{locationPreview.direccion}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {showMapSection && (
              <section className="evd-map-card">
                <div className="evd-map-head">
                  <div>
                    <p className="evd-map-kicker">Ubicación</p>
                    <h2 className="evd-map-title">Dónde es</h2>
                  </div>
                </div>

                {mapEmbedUrl ? (
                  <div className="evd-map-frame">
                    <iframe
                      title={`Mapa de ${locationPreview.nombre || ev.titulo || "evento"}`}
                      src={mapEmbedUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : null}

                <div className="evd-map-copy">
                  {locationPreview.nombre && <strong>{locationPreview.nombre}</strong>}
                  {locationPreview.direccion && <span>{locationPreview.direccion}</span>}
                  {oasisLabel && <small>{oasisLabel}</small>}
                </div>

                {mapExternalUrl && (
                  <div className="evd-map-actions">
                    <a
                      className="evd-map-action"
                      href={mapExternalUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir mapa
                    </a>
                  </div>
                )}
              </section>
            )}
          </section>
        </div>

        <div className="evd-actions">
          <button className="back-btn" onClick={() => nav(-1)}>← Volver</button>
        </div>
      </div>
    </main>
  );
}
