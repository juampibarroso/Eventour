import React, { useState, useEffect, useRef } from "react";
import "../styles/HeroCarousel.css";

// ✅ Importación de imágenes para que funcionen en producción (Vite)
import img1 from "../assets/88.png";
import img2 from "../assets/33.jpg";
import img3 from "../assets/55.jpg";
import img4 from "../assets/14.jpg";
import img5 from "../assets/99.jpg";
import img6 from "../assets/12.jpg";

// ✅ Lista de slides con imágenes importadas
const slides = [
  {
    id: 1,
    image: img1,
    title: "Deportes y Aventura",
    subtitle: "Maratones, trekking, ciclismo, torneos deportivos y actividades al aire libre.",
  },
  {
    id: 2,
    image: img2,
    title: "Gastronomía y Vino",
    subtitle: "Degustaciones, ferias gastronómicas, festivales de vino y cenas temáticas.",
  },
  {
    id: 3,
    image: img3,
    title: "Ferias y Exposiciones",
    subtitle: "Ferias de emprendedores, artesanías, tecnología, moda y belleza.",
  },
  {
    id: 4,
    image: img4,
    title: "Música y Espectáculos",
    subtitle: "Conciertos, recitales, teatro, danza y cine.",
  },
  {
    id: 5,
    image: img5,
    title: "Arte y Cultura",
    subtitle: "Exposiciones, ferias culturales, presentaciones literarias y actividades tradicionales.",
  },
  {
    id: 6,
    image: img6,
    title: "Charlas y Eventos Empresariales",
    subtitle: "Charlas y eventos empresariales con impacto local e internacional.",
  },
];

const AUTO_SLIDE_INTERVAL = 8000;

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

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
              <h1 className="title fade-text show">{slide.title}</h1>
              <p className="subtitle fade-text show">{slide.subtitle}</p>
              <div className="carousel-buttons">
                <a href="#eventos" className="btn-carousel">Ver Eventos</a>
              </div>
            </div>
          )}
        </div>
      ))}

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
