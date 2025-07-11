import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import "../styles/EventosDestacados.css";
import "../styles/EventListPage.css"; // Reutilizamos grid y estilos

const EventosDestacados = () => {
  const [eventosDestacados, setEventosDestacados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/eventos") // URL base
      .then((res) => res.json())
      .then((data) => {
        const filtrados = data.filter((evento) => evento.destacado === true);
        setEventosDestacados(filtrados);
      })
      .catch((error) =>
        console.error("Error al obtener eventos destacados:", error)
      );
  }, []);

  return (
    <div className="eventos-destacados-container">
      <h1 className="titulo">🌟 Eventos Destacados</h1>
      <p className="descripcion">Descubrí los mejores eventos seleccionados para vos.</p>

      {eventosDestacados.length > 0 ? (
        <div className="eventos-grid">
          {eventosDestacados.map((evento) => (
            <EventCard key={evento.id} event={evento} />
          ))}
        </div>
      ) : (
        <p className="no-eventos">No hay eventos destacados en este momento.</p>
      )}
    </div>
  );
};

export default EventosDestacados;
