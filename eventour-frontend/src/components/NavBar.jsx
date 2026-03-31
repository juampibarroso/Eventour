import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(v => !v);
  const closeMenu  = () => setMenuOpen(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Barra de navegación">
      <div className="navbar-container">
        <Link to="/" onClick={closeMenu} className="brand" aria-label="Inicio">
          <img src={logo} alt="Eventour" className="navbar-logo" />
        </Link>

        <div id="primary-nav" className={`nav-links ${menuOpen ? "active" : ""}`}>
          {location.pathname !== "/" && <Link to="/" onClick={closeMenu}>Inicio</Link>}
          {location.pathname === "/" ? (
            <a href="#buscar-eventos" onClick={closeMenu}>Buscar Eventos</a>
          ) : (
            <Link to="/#buscar-eventos" onClick={closeMenu}>Buscar Eventos</Link>
          )}
          <Link to="/events" onClick={closeMenu}>Ver Todos los Eventos</Link>
          {location.pathname === "/" ? (
            <a href="#sobre-nosotros" onClick={closeMenu}>Sobre Nosotros</a>
          ) : (
            <Link to="/#sobre-nosotros" onClick={closeMenu}>Sobre Nosotros</Link>
          )}
        </div>

        {/* Hamburguesa */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Abrir menú"
          aria-controls="primary-nav"
          aria-expanded={menuOpen}
        >
          <span className={`bar ${menuOpen ? "open" : ""}`} />
          <span className={`bar ${menuOpen ? "open" : ""}`} />
          <span className={`bar ${menuOpen ? "open" : ""}`} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
