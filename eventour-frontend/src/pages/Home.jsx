import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import HeroCarousel from "../components/HeroCarousel";
import Navbar from "../components/NavBar";
import BannerLogo from "../components/BannerLogo";
import Footer from "../components/Footer";
import SobreNosotros from "../components/SobreNosotros";
import BusquedaRapida from "../components/BusquedaRapida";


const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroCarousel />      
      <BannerLogo />    

      {/* Texto debajo del Banner */}
      <div className="banner-text">Buscá. Encontrá. Disfrutá.</div>
    
      <BusquedaRapida />
      <SobreNosotros />
      <Footer />
      

    </div>
  );
};

export default Home;
