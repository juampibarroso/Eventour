function EventCard({ event }) {
    return (
      <div className="event-card">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p><strong>Fecha:</strong> {event.date}</p>
        <p><strong>Ubicación:</strong> {event.location}</p>
      </div>
    );
  }
  
  export default EventCard;
  