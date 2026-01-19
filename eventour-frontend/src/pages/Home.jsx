import React from "react";
// Nota: en producción (Linux) el filesystem es case-sensitive.
// El archivo real es "home.css".
import "../styles/home.css";
import HeroCarousel from "../components/HeroCarousel";
import BannerLogo from "../components/BannerLogo";
import Footer from "../components/Footer";
import SobreNosotros from "../components/SobreNosotros";
import BusquedaRapida from "../components/BusquedaRapida";
import BannerBlock from "../ads/BannerBlock";


const Home = () => {
  return (
    <div>
      <HeroCarousel />

      {/* —— Sección Logo + Claim —— */}
      <section className="banner-section">
        <div className="banner-container">
          {/* Asegurate de que dentro de BannerLogo la imagen tenga className="banner-logo" */}
          <BannerLogo />
        </div>

        {/* Texto debajo del Logo */}
        <div className="banner-text">Buscá Encontrá Disfrutá</div>
      </section>

      {/* Banners (debajo del logo, arriba de la búsqueda rápida) */}
      <BannerBlock slots={["HOME_TOP_1", "HOME_TOP_2"]} />

      <BusquedaRapida />

      {/* Banners (entre búsqueda rápida y “¿Quiénes somos?”) */}
      <BannerBlock slots={["HOME_MID_1", "HOME_MID_2"]} />

      <SobreNosotros />
      <Footer />
    </div>
  );
};

export default Home;
