import React, { useState, useEffect, useRef } from "react";
import "../styles/HeroCarousel.css";

const slides = [
  {
    id: 1,
    image: "./src/assets/fondos/1.jpg",
    title: "Deportes y Aventura",
    subtitle: "Maratones, trekking, ciclismo, torneos deportivos y actividades al aire libre.",
  },
  {
    id: 2,
    image: "./src/assets/fondos/2.jpg",
    title: "Gastronomía y Vino",
    subtitle: "Degustaciones, ferias gastronómicas, festivales de vino y cenas temáticas.",
  },
  {
    id: 3,
    image: "./src/assets/fondos/11.jpg",
    title: "Ferias y Exposiciones",
    subtitle: "Ferias de emprendedores, artesanías, tecnología, moda y belleza.",
  },
  {
    id: 4,
    image: "./src/assets/fondos/7.jpg",
    title: "Música y Espectáculos",
    subtitle: "Conciertos, recitales, teatro, danza y cine.",
  },
  {
    id: 5,
    image: "./src/assets/fondos/6.jpg",
    title: "Arte y Cultura",
    subtitle: "Exposiciones, ferias culturales, presentaciones literarias y actividades tradicionales.",
  },
  {
    id: 6,
    image: "./src/assets/fondos/12.jpg",
    title: "Charlas y Eventos Empresariales",
    subtitle: "Charlas y eventos empresariales con impacto local e internacional.",
  },
];

const AUTO_SLIDE_INTERVAL = 8000; // 8 segundos

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  // Cambiar al siguiente slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  // Cambiar al slide anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  // Resetear temporizador
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Temporizador automático
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, AUTO_SLIDE_INTERVAL);

    return () => resetTimeout();
  }, [currentIndex]);

  return (
    <section className="hero-carousel">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          {index === currentIndex && (
            <div className="overlay">
            <h1 className={`title fade-text show`}>{slide.title}</h1>
            <p className={`subtitle fade-text show`}>{slide.subtitle}</p>
            <div className="carousel-buttons">
              <a href="#eventos" className="btn-carousel">Ver Eventos</a>
              <a href="#destacados" className="btn-carousel btn-outline">Más Info</a>
            </div>
          </div>
          )}
        </div>
      ))}

      {/* Botones de navegación */}
      <button className="carousel-nav left" onClick={() => {
        prevSlide();
        resetTimeout();
      }}>
        ❮
      </button>
      <button className="carousel-nav right" onClick={() => {
        nextSlide();
        resetTimeout();
      }}>
        ❯
      </button>
    </section>
  );
};

export default HeroCarousel;
