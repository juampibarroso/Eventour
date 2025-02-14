// EventListPage.jsx
import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/Api.js'; // Asegúrate de que la ruta sea correcta
import '../styles/EventListPage.css'; // Archivo CSS para los estilos

const EventListPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents();
      setEvents(data);
    }
    fetchEvents();
  }, []);

  return (
    <div className="event-list-page">
      <h1>Todos los Eventos</h1>
      {events.length === 0 ? (
        <p>No hay eventos disponibles.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h2>{event.titulo}</h2>
              <p>{event.descripcion}</p>
              <p><strong>Fecha:</strong> {new Date(event.fechaInicio).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> {event.estado}</p>
              <p><strong>Categoría:</strong> {event.categoriaEvento}</p>
            
              <p><strong>Ubicación:</strong> {event.ubicacion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventListPage;
