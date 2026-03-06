import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HeroCarousel.css";

import img1 from "../assets/88.png";
import img2 from "../assets/33.jpg";
import img3 from "../assets/55.jpg";
import img4 from "../assets/105.jpg";
import img5 from "../assets/99.jpg";
import img6 from "../assets/333.jpg";

const slides = [
  { id: 1, image: img1, title: "Deportes y Aventura", subtitle: "Maratones, trekking, ciclismo, torneos deportivos y actividades al aire libre." },
  { id: 2, image: img2, title: "Gastronomía y Vino", subtitle: "Degustaciones, ferias gastronómicas, festivales de vino y cenas temáticas." },
  { id: 3, image: img3, title: "Ferias y Exposiciones", subtitle: "Ferias de emprendedores, artesanías, tecnología, moda y belleza." },
  { id: 4, image: img4, title: "Música y Espectáculos", subtitle: "Conciertos, recitales, teatro, danza y cine." },
  { id: 5, image: img5, title: "Arte y Cultura", subtitle: "Exposiciones, ferias culturales, presentaciones literarias y actividades tradicionales." },
  { id: 6, image: img6, title: "Charlas y Eventos Empresariales", subtitle: "Charlas y eventos empresariales con impacto local e internacional." },
];

const AUTO_SLIDE_INTERVAL = 7000; // un pelín más rápido en móvil
const EVENTS_ROUTE = "/events";

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const tRef = useRef(null);
  const navigate = useNavigate();

  const next = () => setCurrentIndex((p) => (p + 1) % slides.length);
  const prev = () => setCurrentIndex((p) => (p === 0 ? slides.length - 1 : p - 1));
  const clear = () => tRef.current && clearTimeout(tRef.current);

  useEffect(() => {
    clear();
    tRef.current = setTimeout(next, AUTO_SLIDE_INTERVAL);
    return clear;
  }, [currentIndex]);

  const handleVerEventos = () => {
    try { navigate(EVENTS_ROUTE); } catch { window.location.href = EVENTS_ROUTE; }
  };

  return (
    <section className="hero-carousel" aria-roledescription="carousel">
      {/* Máscara superior para que el navbar se lea y no se vea “duro” el borde */}
      <div className="hero-gradient-top" aria-hidden="true" />

      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`slide ${i === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${s.image})` }}
          role="group"
          aria-label={`${i + 1} de ${slides.length}: ${s.title}`}
          aria-hidden={i !== currentIndex}
        >
          {i === currentIndex && (
            <div className="overlay">
              <h1 className="hero-title">{s.title}</h1>
              <p className="hero-subtitle">{s.subtitle}</p>
              <button
                type="button"
                className="btn-carousel"
                onClick={handleVerEventos}
              >
                Ver Eventos
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        className="carousel-nav left"
        onClick={() => { prev(); clear(); }}
        aria-label="Anterior"
      >❮</button>

      <button
        className="carousel-nav right"
        onClick={() => { next(); clear(); }}
        aria-label="Siguiente"
      >❯</button>
    </section>
  );
};

export default HeroCarousel;
