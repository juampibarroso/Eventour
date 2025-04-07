// src/components/BannerLogo.jsx
import React from "react";
import "../styles/BannerLogo.css";
import logo from "../assets/bannernegro.jpg"; // Asegurate de que esta ruta sea válida

const BannerLogo = () => {
  return (
    <section className="banner-logo">
      <img src={logo} alt="Eventour" className="banner-image" />
    </section>
  );
};

export default BannerLogo;
