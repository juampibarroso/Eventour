import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/EventDetailPage.css";

const EventDetailPage = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/eventos/${id}`)
      .then((res) => res.json())
      .then((data) => setEvento(data))
      .catch((err) => console.error("Error al cargar el evento", err));
  }, [id]);

  if (!evento) return <p className="cargando-evento">Cargando evento...</p>;

  return (
    <div className="evento-detalle-container">
      <div className="evento-banner">
        {evento.imagen && (
          <img src={evento.imagen} alt={evento.titulo} />
        )}
      </div>
      <div className="evento-detalle-contenido">
        <h1>{evento.titulo}</h1>
        {evento.descripcion && (
          <p className="evento-descripcion">{evento.descripcion}</p>
        )}
        <div className="evento-datos">
          {evento.fechaInicio && evento.fechaFin && (
            <p><strong>📅 Fecha:</strong> {evento.fechaInicio} — {evento.fechaFin}</p>
          )}
          {typeof evento.precio === "number" && (
            <p><strong>💸 Precio:</strong> ${evento.precio}</p>
          )}
          {typeof evento.categoriaEvento === "string" && (
            <p><strong>🎭 Categoría:</strong> {evento.categoriaEvento}</p>
          )}
          {typeof evento.estado === "string" && (
            <p><strong>📌 Estado:</strong> {evento.estado}</p>
          )}
        </div>
        <Link to="/" className="volver-link">← Volver a eventos</Link>
      </div>
    </div>
  );
};

export default EventDetailPage;
