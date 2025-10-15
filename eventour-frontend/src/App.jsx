import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import BusquedaUbicacion from "./pages/BusquedaUbicacion";
import BusquedaCategoria from "./pages/BusquedaCategoria";
import BusquedaFecha from "./pages/BusquedaFecha";
import EventosDestacados from "./pages/EventosDestacados";
import EventListPage from "./pages/EventListPage";
import LoginAdmin from "./components/admin/LoginAdmin";
import DashboardAdmin from "./components/admin/DashboardAdmin";
import EventDetailPage from "./pages/EventDetailPage";

// ——— UX: vuelve al top en cada navegación ———
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

function App() {
  const [adminAuth, setAdminAuth] = useState(false);

  return (
    <div className="app-container">
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Crear evento */}
        <Route path="/create-event" element={<CreateEvent />} />

        {/* Búsquedas */}
        <Route path="/busqueda-ubicacion" element={<BusquedaUbicacion />} />
        <Route path="/busqueda-categoria" element={<BusquedaCategoria />} />
        <Route path="/busqueda-fecha" element={<BusquedaFecha />} />

        {/* Destacados */}
        <Route path="/eventos-destacados" element={<EventosDestacados />} />

        {/* Todos los eventos */}
        <Route path="/events" element={<EventListPage />} />

        {/* Legacy redirect (por si tenías enlaces antiguos) */}
        <Route path="/eventos" element={<Navigate to="/events" replace />} />

        {/* Detalle */}
        <Route path="/evento/:id" element={<EventDetailPage />} />

        {/* Admin protegido */}
        <Route
          path="/admin/dashboard"
          element={adminAuth ? <DashboardAdmin /> : <Navigate to="/admin" replace />}
        />
        <Route
          path="/admin"
          element={
            adminAuth ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <LoginAdmin onLogin={setAdminAuth} />
            )
          }
        />

        {/* 404 simple: redirige al home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
