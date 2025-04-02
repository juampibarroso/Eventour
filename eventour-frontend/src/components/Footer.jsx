// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-title">Eventour</p>
        <p>📍 Mendoza, Argentina</p>
        <p>📞 +54 9 261 123 4567</p>
        <p>✉️ contacto@eventour.com</p>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Eventour. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
