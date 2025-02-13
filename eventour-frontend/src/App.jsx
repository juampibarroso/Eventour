import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import BusquedaUbicacion from './pages/BusquedaUbicacion';
import BusquedaCategoria from './pages/BusquedaCategoria';
import BusquedaFecha from './pages/BusquedaFecha';
import EventosDestacados from './pages/EventosDestacados';

function App() {
  return (
    
    <div>

      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/create-event">Crear Evento</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/busqueda-ubicacion" element={<BusquedaUbicacion />} />
        <Route path="/busqueda-categoria" element={<BusquedaCategoria />} />
        <Route path="/busqueda-fecha" element={<BusquedaFecha />} />
        <Route path="/eventos-destacados" element={<EventosDestacados />} />
      
      
      
      
      </Routes>

      
    </div>

    
  );
}

export default App;
