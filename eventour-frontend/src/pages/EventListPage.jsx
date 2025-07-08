import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/Api.js';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import '../styles/EventListPage.css';

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
      <header className="event-list-header">
        <h1>Todos los Eventos</h1>
        <p>Explorá y filtrá eventos según tu interés:</p>
        <div className="event-nav-grid">
          <Link to="/busqueda-categoria" className="nav-card">
            <span role="img" aria-label="categoría">🎭</span>
            Categorías
          </Link>
          <Link to="/busqueda-ubicacion" className="nav-card">
            <span role="img" aria-label="ubicación">📍</span>
            Ubicación
          </Link>
          <Link to="/busqueda-fecha" className="nav-card">
            <span role="img" aria-label="fecha">📅</span>
            Fechas
          </Link>
          <Link to="/eventos-destacados" className="nav-card">
            <span role="img" aria-label="destacados">🌟</span>
            Destacados
          </Link>
        </div>
      </header>

      <section className="event-list-content">
        {events.length === 0 ? (
          <p className="no-eventos">No hay eventos disponibles.</p>
        ) : (
          <div className="eventos-grid">
            {events.map((evento) => (
              <EventCard key={evento.id} event={evento} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default EventListPage;
