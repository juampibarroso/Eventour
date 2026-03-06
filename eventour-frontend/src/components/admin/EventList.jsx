// src/components/admin/EventList.jsx
import React from "react";

const toISO = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(+dt)) return "";
  return dt.toISOString().slice(0, 10);
};

export default function EventList({ eventos, onEdit, onDelete }) {
  if (!Array.isArray(eventos) || eventos.length === 0) {
    return <p className="no-eventos">No hay eventos.</p>;
  }

  return (
    <div className="event-list">
      {eventos.map((ev) => (
        <div key={ev.id} className="evento-item">
          <div className="evento-info">
            <h3>{ev.titulo}</h3>
            {ev.descripcion && <p>{ev.descripcion}</p>}
            <p className="evento-fecha">
              {toISO(ev.fechaInicio || ev.fecha)}
              {ev.fechaFin ? ` → ${toISO(ev.fechaFin)}` : ""}
            </p>
            {Number(ev.precio) > 0 && <p>${Number(ev.precio).toLocaleString("es-AR")}</p>}
            {ev.categoria && <span className="evento-categoria">{ev.categoria}</span>}
          </div>
          <div className="evento-actions">
            <button className="btn-editar" onClick={() => onEdit(ev)}>Editar</button>
            <button className="btn-eliminar" onClick={() => onDelete(ev.id)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
