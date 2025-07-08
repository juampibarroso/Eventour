import './EventCard.css';
import { Link } from 'react-router-dom';

function EventCard({ event }) {
  return (
    <div className="event-card">
      <div className="event-img-container">
        <Link to={`/evento/${event.id}`}>
          <img
            src={event.imagen}
            alt={event.titulo}
            className="event-img"
          />
        </Link>
      </div>
      <div className="event-info">
        <Link to={`/evento/${event.id}`} className="event-title-link">
          <h3>{event.titulo}</h3>
        </Link>
        <p>{event.descripcion}</p>
        <p><strong>Fecha Inicio:</strong> {event.fechaInicio}</p>
        <p><strong>Fecha Fin:</strong> {event.fechaFin}</p>
        <p><strong>Precio:</strong> ${event.precio}</p>
        <p><strong>Categoría:</strong> {event.categoriaEvento}</p>
      </div>
    </div>
  );
}

export default EventCard;
