// src/pages/BusquedaFecha.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, getJson } from "../lib/api";
import "../styles/BusquedaFecha.css";

const toISO = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(+dt)) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const da = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
};

const normalizeRange = (ev) => {
  const s = ev.fechaInicio ?? ev.startDate ?? ev.fecha;
  const e = ev.fechaFin ?? ev.endDate ?? ev.fecha;
  const start = s ? new Date(s) : null;
  const end = e ? new Date(e) : null;
  const startOk = start && !Number.isNaN(+start);
  const endOk = end && !Number.isNaN(+end);
  if (!startOk && !endOk) return null;
  return { start: startOk ? start : end, end: endOk ? end : start };
};

const overlap = (a1, a2, b1, b2) => {
  const A1 = new Date(toISO(a1));
  const A2 = new Date(toISO(a2));
  const B1 = new Date(toISO(b1));
  const B2 = new Date(toISO(b2));
  return A1 <= B2 && B1 <= A2;
};

export default function BusquedaFecha() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const today = toISO(new Date());
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const evs = await getJson(`${API_BASE}/eventos`, { auth: false });
        if (ignore) return;
        const normalized = (Array.isArray(evs) ? evs : [])
          .map((ev) => {
            const r = normalizeRange(ev);
            return r ? { ...ev, __r: r } : null;
          })
          .filter(Boolean);
        setEvents(normalized);
      } catch (e) {
        console.error(e);
        if (!ignore) setErr("No se pudieron cargar los eventos.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!from || !to) return [];
    const f = new Date(from);
    const t = new Date(to);
    return [...events]
      .filter((ev) => overlap(f, t, ev.__r.start, ev.__r.end))
      .sort((a, b) => a.__r.start - b.__r.start);
  }, [events, from, to]);

  // chips rápidos
  const setHoy = () => { const h = toISO(new Date()); setFrom(h); setTo(h); };
  const setFinDeSemana = () => {
    const now = new Date();
    const day = now.getDay(); // 0=dom
    const diffToSat = (6 - day + 7) % 7; // sábado
    const diffToSun = (7 - day) % 7;     // domingo
    const sat = new Date(now); sat.setDate(now.getDate() + diffToSat);
    const sun = new Date(now); sun.setDate(now.getDate() + diffToSun);
    setFrom(toISO(sat)); setTo(toISO(sun));
  };
  const setMes = () => {
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    setFrom(toISO(start)); setTo(toISO(end));
  };
  const clear = () => { setFrom(""); setTo(""); };

  return (
    <main className="df-page" role="main" aria-labelledby="df-title">
      <header className="df-head">
        <h1 id="df-title" className="df-title">Buscar por Fecha</h1>
        <p className="df-sub">Elegí un rango para ver eventos dentro de esas fechas.</p>
      </header>

      <section className="df-controls" aria-label="Rango de fechas">
        <div className="df-inputs">
          <label className="df-field">
            <span className="df-field-label">Desde</span>
            <input
              type="date"
              value={from || ""}
              onChange={(e) => setFrom(e.target.value)}
              max={to || ""}
              className="df-date"
              aria-label="Fecha desde"
            />
          </label>

          <label className="df-field">
            <span className="df-field-label">Hasta</span>
            <input
              type="date"
              value={to || ""}
              onChange={(e) => setTo(e.target.value)}
              min={from || ""}
              className="df-date"
              aria-label="Fecha hasta"
            />
          </label>
        </div>

        <div className="df-quick" role="group" aria-label="Atajos">
          <button className="df-chip" onClick={setHoy}>Hoy</button>
          <button className="df-chip" onClick={setFinDeSemana}>Fin de semana</button>
          <button className="df-chip" onClick={setMes}>Este mes</button>
          <button className="df-clear" onClick={clear}>Limpiar</button>
        </div>

        {(from || to) && (
          <div className="df-active" aria-live="polite">
            <span className="df-badge">🗓️ {from || "—"} {to ? `→ ${to}` : ""}</span>
          </div>
        )}
      </section>

      <section className="df-results" aria-live="polite">
        {loading ? (
          <div className="df-state">Cargando…</div>
        ) : err ? (
          <div className="df-state">⚠️ {err}</div>
        ) : (from && to && filtered.length === 0) ? (
          <div className="df-state">No hay eventos para el rango seleccionado.</div>
        ) : (
          <ul className="df-grid">
            {filtered.map((ev) => {
              const title = ev.titulo || ev.nombre || "Evento";
              const place = ev.ubicacion?.nombre || ev.ubicacionTexto || ev.venue || "";
              const start = toISO(ev.__r.start);
              const end = toISO(ev.__r.end);
              return (
                <li
                  key={ev.id}
                  className="df-card"
                  onClick={() => navigate(`/evento/${ev.id}`)}
                >
                  <div className="df-card-date" aria-hidden="true">🗓️</div>
                  <div className="df-card-main">
                    <h3 className="df-card-title">{title}</h3>
                    {place && <div className="df-card-place">{place}</div>}
                    <div className="df-card-meta">
                      {start && end && start !== end ? (
                        <span className="df-card-range">{start} → {end}</span>
                      ) : (
                        <span className="df-card-range">{start}</span>
                      )}
                      <button
                        className="df-card-link"
                        onClick={(e) => { e.stopPropagation(); navigate(`/evento/${ev.id}`); }}
                      >
                        Ver detalle →
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
