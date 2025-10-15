import React from "react";
import "../styles/Home.css";
import HeroCarousel from "../components/HeroCarousel";
import BannerLogo from "../components/BannerLogo";
import Footer from "../components/Footer";
import SobreNosotros from "../components/SobreNosotros";
import BusquedaRapida from "../components/BusquedaRapida";

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

      <BusquedaRapida />
      <SobreNosotros />
      <Footer />
    </div>
  );
};

export default Home;
