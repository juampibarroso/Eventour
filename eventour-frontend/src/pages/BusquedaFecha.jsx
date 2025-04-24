import { useState } from "react";
import "../styles/BusquedaFecha.css";

const BusquedaFecha = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [eventos, setEventos] = useState([]);

  const buscarEventos = () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor, seleccioná ambas fechas.");
      return;
    }

    fetch(`https://tu-backend.com/api/eventos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((error) => console.error("Error al obtener eventos:", error));
  };

  return (
    <div className="busqueda-fecha-container">
      <h1 className="titulo-fecha">Buscar por Fecha</h1>
      <p className="descripcion-fecha">Explorá los eventos que ocurren dentro de un rango determinado.</p>

      <div className="fecha-card">
        <div className="fecha-input-group">
          <label className="label-fecha">Desde:</label>
          <input
            type="date"
            className="input-fecha"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className="fecha-input-group">
          <label className="label-fecha">Hasta:</label>
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
      </div>

      <div className="eventos-container">
        <h2 className="subtitulo">Resultados</h2>
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
          <p className="no-eventos">No se encontraron eventos en este rango.</p>
        )}
      </div>
    </div>
  );
};

export default BusquedaFecha;
