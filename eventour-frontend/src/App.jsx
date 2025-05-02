import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import BusquedaUbicacion from './pages/BusquedaUbicacion';
import BusquedaCategoria from './pages/BusquedaCategoria';
import BusquedaFecha from './pages/BusquedaFecha';
import EventosDestacados from './pages/EventosDestacados';
import EventListPage from "./pages/EventListPage";
import LoginAdmin from "./components/admin/LoginAdmin";
import DashboardAdmin from "./components/admin/DashboardAdmin";

function App() {
  const [adminAuth, setAdminAuth] = useState(false); // ✅ Estado agregado

  return (
    <div className="app-container">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/busqueda-ubicacion" element={<BusquedaUbicacion />} />
        <Route path="/busqueda-categoria" element={<BusquedaCategoria />} />
        <Route path="/busqueda-fecha" element={<BusquedaFecha />} />
        <Route path="/eventos-destacados" element={<EventosDestacados />} />
        <Route path="/events" element={<EventListPage />} />
        <Route
          path="/admin/dashboard"
          element={
            adminAuth ? <DashboardAdmin /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/admin"
          element={
            adminAuth ? <Navigate to="/admin/dashboard" /> : <LoginAdmin onLogin={setAdminAuth} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;

