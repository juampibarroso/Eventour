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
          <p className="busqueda-desc">	Busca eventos cerca tuyo o en tu zona preferida.</p>
        </Link>

        <Link to="/busqueda-categoria" className="busqueda-card categoria">
          <i className="fas fa-tags icono" />
          <h3 className="busqueda-label">Por Categoría</h3>
          <p className="busqueda-desc">	Filtrá por el tipo de evento que más te guste.</p>
        </Link>

        <Link to="/busqueda-fecha" className="busqueda-card fecha">
          <i className="fas fa-calendar-alt icono" />
          <h3 className="busqueda-label">Por Fecha</h3>
          <p className="busqueda-desc">	Encontrá qué hacer en la fecha que elijas.</p>
        </Link>

        <Link to="/eventos-destacados" className="busqueda-card destacados">
          <i className="fas fa-star icono" />
          <h3 className="busqueda-label">Destacados</h3>
          <p className="busqueda-desc">	Descubrí eventos imperdibles seleccionados para vos.</p>
        </Link>
      </div>
    </section>
  );
};

export default BusquedaRapida;
