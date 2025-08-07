import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import "../styles/BusquedaCategoria.css";
import "../styles/EventListPage.css";

const BusquedaFecha = () => {
  const [eventos, setEventos] = useState([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // ✅ Agregado para producción
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // 🔄 Ruta corregida para usar la variable de entorno
    fetch(`${API}/eventos`)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error("Error al obtener eventos:", err));
  }, []);

  const eventosFiltrados = eventos.filter((evento) => {
    const fechaEvento = new Date(evento.fechaInicio);
    const eventoSinHora = new Date(fechaEvento.toISOString().split("T")[0]); // Solo fecha

    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;

    if (desde && eventoSinHora < desde) return false;
    if (hasta && eventoSinHora > hasta) return false;

    return true;
  });

  return (
    <div className="busqueda-container">
      <h1 className="titulo">Buscar por Fecha</h1>
      <p className="descripcion">
        Seleccioná una fecha o un rango para ver los eventos disponibles.
      </p>

      <div className="filtros-fecha">
        <input
          type="date"
          className="input-fecha"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
        />
        <input
          type="date"
          className="input-fecha"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
        />
      </div>

      <div className="eventos-container">
        {eventosFiltrados.length > 0 ? (
          <>
            <h2 className="subtitulo">Eventos encontrados:</h2>
            <div className="eventos-grid">
              {eventosFiltrados.map((evento) => (
                <EventCard key={evento.id} event={evento} />
              ))}
            </div>
          </>
        ) : (
          <p className="no-eventos">No hay eventos para la fecha seleccionada.</p>
        )}
      </div>
    </div>
  );
};

export default BusquedaFecha;
