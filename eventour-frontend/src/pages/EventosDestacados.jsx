import { useState, useEffect } from "react";
import "../styles/EventosDestacados.css"; // Importamos el CSS

const EventosDestacados = () => {
  const [eventos, setEventos] = useState([]);

  // Obtener eventos destacados desde el backend
  useEffect(() => {
    fetch("https://tu-backend.com/api/eventos/destacados") // Modifica con la URL real
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((error) =>
        console.error("Error al obtener eventos destacados:", error)
      );
  }, []);

  return (
    <div className="eventos-destacados-container">
      <h1 className="titulo">Eventos Destacados</h1>
      <p className="descripcion">Aquí podrás ver los eventos más destacados.</p>

      <div className="eventos-container">
        {eventos.length > 0 ? (
          <div className="eventos-lista">
            {eventos.map((evento) => (
              <div key={evento.id} className="evento-card">
                <h3 className="evento-titulo">{evento.nombre}</h3>
                <p className="evento-descripcion">{evento.descripcion}</p>
                <p className="evento-fecha">{evento.fecha}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-eventos">No hay eventos destacados en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default EventosDestacados;
