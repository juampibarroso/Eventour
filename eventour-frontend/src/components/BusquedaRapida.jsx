import React from "react";
import { Link } from "react-router-dom";
import "../styles/BusquedaRapida.css";

const BusquedaRapida = () => {
  return (
    <section className="busqueda-rapida-section" id="buscar-eventos">
      <h2 className="busqueda-titulo">¿Qué querés explorar?</h2>

      <div className="busqueda-grid">
        <Link to="/busqueda-ubicacion" className="busqueda-card ubicacion">
          <i className="fas fa-map-marker-alt icono" />
          <h3 className="busqueda-label">Por Ubicación</h3>
          <p className="busqueda-desc">Encontrá eventos cerca tuyo o en tu lugar favorito.</p>
        </Link>

        <Link to="/busqueda-categoria" className="busqueda-card categoria">
          <i className="fas fa-tags icono" />
          <h3 className="busqueda-label">Por Categoría</h3>
          <p className="busqueda-desc">Explorá por tipo de evento: música, arte, ferias y más.</p>
        </Link>

        <Link to="/busqueda-fecha" className="busqueda-card fecha">
          <i className="fas fa-calendar-alt icono" />
          <h3 className="busqueda-label">Por Fecha</h3>
          <p className="busqueda-desc">Buscá lo que hay hoy, este finde o más adelante.</p>
        </Link>

        <Link to="/eventos-destacados" className="busqueda-card destacados">
          <i className="fas fa-star icono" />
          <h3 className="busqueda-label">Destacados</h3>
          <p className="busqueda-desc">Lo mejor de Mendoza, recomendado por todos.</p>
        </Link>
      </div>
    </section>
  );
};

export default BusquedaRapida;
