import { useEffect, useState } from "react";
import { getEvents } from "../services/Api";
import EventCard from "./EventCard";
import "../styles/EventList.css"; // asegurate de tener estilos si querés un layout en grilla o columnas

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error al obtener eventos:", err);
        setError("No se pudieron cargar los eventos.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="eventos-grid">
      {events.length === 0 ? (
        <p>No hay eventos disponibles.</p>
      ) : (
        events.map((event) => <EventCard key={event.id} event={event} />)
      )}
    </div>
  );
}

export default EventList;
