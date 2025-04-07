import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Cierra el menú móvil al navegar
  const handleCloseMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-overlay" />
      <div className="navbar-container">
        <Link to="/" onClick={handleCloseMenu}>
          <img src={logo} alt="Eventour Logo" className="navbar-logo" />
        </Link>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>

          {/* Mostrar "Inicio" solo si no estás en home */}
          {location.pathname !== "/" && (
            <Link to="/" onClick={handleCloseMenu}>
              Inicio
            </Link>
          )}

          {/* Buscar Eventos: ancla si estás en home, Link si no */}
          {location.pathname === "/" ? (
            <a href="#buscar-eventos" onClick={handleCloseMenu}>
              Buscar Eventos
            </a>
          ) : (
            <Link to="/#buscar-eventos" onClick={handleCloseMenu}>
              Buscar Eventos
            </Link>
          )}

          {/* Todos los Eventos */}
          <Link to="/events" onClick={handleCloseMenu}>
            Ver Todos los Eventos
          </Link>

          {/* Sobre Nosotros: ancla si estás en home */}
          {location.pathname === "/" ? (
            <a href="#sobre-nosotros" onClick={handleCloseMenu}>
              Sobre Nosotros
            </a>
          ) : (
            <Link to="/#sobre-nosotros" onClick={handleCloseMenu}>
              Sobre Nosotros
            </Link>
          )}
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`bar ${menuOpen ? "open" : ""}`} />
          <div className={`bar ${menuOpen ? "open" : ""}`} />
          <div className={`bar ${menuOpen ? "open" : ""}`} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
