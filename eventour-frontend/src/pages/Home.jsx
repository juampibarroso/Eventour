import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Asegúrate de importar el archivo CSS

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="title">Bienvenido a Eventour</h1>
      <div className="links-container">
        <Link to="/busqueda-ubicacion" className="link-card">
          <i className="fas fa-map-marker-alt icon"></i>
          <h2 className="link-title">Buscar por Ubicación</h2>
        </Link>
        <Link to="/busqueda-categoria" className="link-card">
          <i className="fas fa-th-list icon"></i>
          <h2 className="link-title">Buscar por Categoría</h2>
        </Link>
        <Link to="/busqueda-fecha" className="link-card">
          <i className="fas fa-calendar-alt icon"></i>
          <h2 className="link-title">Buscar por Fecha</h2>
        </Link>
        <Link to="/eventos-destacados" className="link-card">
          <i className="fas fa-star icon"></i>
          <h2 className="link-title">Eventos Destacados</h2>
        </Link>
      </div>
    </div>
  );
};

export default Home;
