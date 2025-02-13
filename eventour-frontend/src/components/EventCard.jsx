function EventCard({ event }) {
    return (
      <div className="event-card">
        <h3>{event.titulo}</h3>
        <h4>{event.descripcion}</h4>
        <p><strong>Ubicación:</strong> {event.location}</p>
        <p><strong>Fecha Inicio:</strong> {event.fechaInicio}</p>
        <p><strong>Fecha Fin:</strong> {event.fechaFin}</p>
        <p><strong>Precio:</strong> {event.precio}</p>
        <p><strong>Categoria:</strong> {event.categoriaEvento}</p>

        
      </div>
    );
  }
  
  export default EventCard;
  