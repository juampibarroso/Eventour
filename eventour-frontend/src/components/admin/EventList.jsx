// src/components/admin/EventList.jsx
import { formatDisplayDate, getTicketUrl } from "../../lib/eventDisplay";

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
              {formatDisplayDate(ev.fechaInicio || ev.fecha)}
            </p>
            {getTicketUrl(ev) && (
              <p>
                <a
                  className="admin-ticket-link"
                  href={getTicketUrl(ev)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver entradas
                </a>
              </p>
            )}
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
