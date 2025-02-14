import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div>
      {/* Imagen del Banner */}
      <div className="banner-container"></div>

      {/* Texto debajo del Banner */}
      <div className="banner-text">Bienvenido a EvenTour.</div>


      
    
      {/* Contenido Principal */}
      <div className="home-container">
        {/* Cuadros de Búsqueda */}
        <div className="links-container">
          <Link to="/busqueda-ubicacion" className="link-card">
            <i className="fas fa-map-marker-alt icon"></i>
            <span className="link-title">Búsqueda por Ubicación</span>
          </Link>

          <Link to="/busqueda-categoria" className="link-card">
            <i className="fas fa-tags icon"></i>
            <span className="link-title">Búsqueda por Categoría</span>
          </Link>

          <Link to="/busqueda-fecha" className="link-card">
            <i className="fas fa-calendar-alt icon"></i>
            <span className="link-title">Búsqueda por Fecha</span>
          </Link>

          <Link to="/eventos-destacados" className="link-card">
            <i className="fas fa-star icon"></i>
            <span className="link-title">Eventos Destacados</span>
          </Link>
        </div>

        {/* Botón "Ver Todos los Eventos" */}
        <div className="event-button-container">
          <Link to="/events">
            <button className="view-events-button">Ver Todos los Eventos</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
