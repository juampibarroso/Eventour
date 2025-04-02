import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import BusquedaUbicacion from './pages/BusquedaUbicacion';
import BusquedaCategoria from './pages/BusquedaCategoria';
import BusquedaFecha from './pages/BusquedaFecha';
import EventosDestacados from './pages/EventosDestacados';
import EventListPage from "./pages/EventListPage";

function App() {
  return (
    <div className="app-container">
      <Navbar /> {/* ✅ NUEVA NAVBAR GLOBAL */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/busqueda-ubicacion" element={<BusquedaUbicacion />} />
        <Route path="/busqueda-categoria" element={<BusquedaCategoria />} />
        <Route path="/busqueda-fecha" element={<BusquedaFecha />} />
        <Route path="/eventos-destacados" element={<EventosDestacados />} />
        <Route path="/events" element={<EventListPage />} />
      </Routes>
    </div>
  );
}

export default App;
