import React from "react";
import "../../styles/Admin.css";

const EventList = ({ eventos, onEdit, onDelete }) => {
  return (
    <div className="event-list">
      <h2>Eventos Cargados</h2>
      {eventos.length === 0 ? (
        <p className="no-eventos">No hay eventos registrados aún.</p>
      ) : (
        <ul>
          {eventos.map((evento) => (
            <li key={evento.id} className="evento-item">
              <div className="evento-info">
                <h3>{evento.nombre}</h3>
                <p>{evento.descripcion}</p>
                <p className="evento-fecha">📅 {evento.fecha}</p>
                <span className="evento-categoria">🎫 {evento.categoria}</span>
              </div>
              <div className="evento-actions">
                <button className="btn-editar" onClick={() => onEdit(evento)}>Editar</button>
                <button className="btn-eliminar" onClick={() => onDelete(evento.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
