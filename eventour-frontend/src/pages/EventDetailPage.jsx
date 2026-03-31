// src/pages/EventDetailPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE, getJson } from "../lib/api";
import { formatDisplayDate, getTicketUrl } from "../lib/eventDisplay";
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
        <h1 className="evd-title">{ev.titulo || "Evento"}</h1>
        {ev.descripcion && <p className="evd-desc">{ev.descripcion}</p>}
        {ticketUrl && (
          <div className="evd-ticket-block">
            <a
              className="evd-ticket-action"
              href={ticketUrl}
              target="_blank"
              rel="noreferrer"
            >
              Comprar entradas
            </a>
          </div>
        )}

        <div className="evd-info">
          {fechaInicio && (
            <div className="evd-row">
              <div className="evd-key">Fecha</div>
              <div className="evd-val">{fechaInicio}</div>
            </div>
          )}
          {(ev.ubicacion?.nombre || ev.ubicacionTexto) && (
            <div className="evd-row">
              <div className="evd-key">Ubicación</div>
              <div className="evd-val">{ev.ubicacion?.nombre || ev.ubicacionTexto}</div>
            </div>
          )}
        </div>

        <div className="evd-actions">
          <button className="back-btn" onClick={() => nav(-1)}>← Volver</button>
        </div>
      </div>
    </main>
  );
}
