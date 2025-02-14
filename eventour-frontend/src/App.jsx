import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import BusquedaUbicacion from './pages/BusquedaUbicacion';
import BusquedaCategoria from './pages/BusquedaCategoria';
import BusquedaFecha from './pages/BusquedaFecha';
import EventosDestacados from './pages/EventosDestacados';
import EventListPage from "./pages/EventListPage"; // Nueva página de eventos

function App() {
  return (
    <div className="app-container">
      <nav className="nav-bar">
        <Link to="/">Inicio</Link>
        <Link to="/create-event">Crear Evento</Link>
        <Link to="/events">Ver Todos los Eventos</Link> {/* Nuevo enlace */}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/busqueda-ubicacion" element={<BusquedaUbicacion />} />
        <Route path="/busqueda-categoria" element={<BusquedaCategoria />} />
        <Route path="/busqueda-fecha" element={<BusquedaFecha />} />
        <Route path="/eventos-destacados" element={<EventosDestacados />} />
        <Route path="/events" element={<EventListPage />} /> {/* Nueva ruta */}
      </Routes>
    </div>
  );
}

export default App;
