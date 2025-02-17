import { useState } from "react";
import "../styles/BusquedaFecha.css"; // Importamos el CSS

const BusquedaFecha = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [eventos, setEventos] = useState([]);

  // Función para buscar eventos por rango de fechas
  const buscarEventos = () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor, selecciona ambas fechas.");
      return;
    }

    fetch(`https://tu-backend.com/api/eventos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((error) => console.error("Error al obtener eventos:", error));
  };

  return (
    <div className="busqueda-fecha-container">
      <h1 className="titulo">Buscar por Fecha</h1>
      <p className="descripcion">Encuentra eventos dentro de un rango de fechas.</p>

      <div className="fecha-seleccion">
        <label className="label-fecha">Fecha Inicio:</label>
        <input
          type="date"
          className="input-fecha"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />

        <label className="label-fecha">Fecha Fin:</label>
        <input
          type="date"
          className="input-fecha"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
      </div>

      <button className="boton-buscar" onClick={buscarEventos}>
        Buscar Eventos
      </button>

      <div className="eventos-container">
        <h2 className="subtitulo">Eventos encontrados:</h2>
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
          <p className="no-eventos">No hay eventos en este rango de fechas.</p>
        )}
      </div>
    </div>
  );
};

export default BusquedaFecha;
