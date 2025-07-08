import React from "react";
import EventCard from "../EventCard"; // asegurate que la ruta sea correcta
import "../../styles/EventListPage.css"; // o el CSS que tenga `.eventos-grid`
import "../../styles/Admin.css";

const EventList = ({ eventos, onEdit, onDelete }) => {
  return (
    <div className="eventos-grid">
      {eventos.map((event) => (
        <div key={event.id} className="evento-admin-card">
          <EventCard event={event} />
          <div className="admin-buttons">
            <button onClick={() => onEdit(event)} className="edit-button">✏️ Editar</button>
            <button onClick={() => onDelete(event.id)} className="delete-button">🗑 Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
