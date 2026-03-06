import React from "react";
import "../styles/SobreNosotros.css";

const SobreNosotros = () => {
  return (
    <section className="sobre-nosotros-section" id="sobre-nosotros">

      <h2 className="sobre-titulo">¿Quiénes somos?</h2>

      <div className="qa-container">
        <div className="qa-item">
          <h3 className="pregunta">🧭 ¿Qué es Eventour?</h3>
          <p className="respuesta">
            Una plataforma digital que centraliza y organiza todos los eventos de Mendoza. Ofreciendo una experiencia completa para descubrir y planificar tu proxima salida.
          </p>
        </div>

        <div className="qa-item">
          <h3 className="pregunta">🎉 ¿Como puedo bucar eventos?</h3>
          <p className="respuesta">
            Utiliza nuestros filtros inteligentes para encontrar eventos por zona geográfica, categoría, fecha y ubicación. Es fácil y rápido!
          </p>
        </div>

        <div className="qa-item">
          <h3 className="pregunta">👥 ¿La informacion es confiable?</h3>
          <p className="respuesta">
            Si, los eventos vienen de fuentes verificadas, instituciones publicas o privadas y organizadores reconocidos, garantizando datos actualizados y oficiales.
          </p>
        </div>

        <div className="qa-item">
          <h3 className="pregunta">💡 ¿Eventour incluye todos los eventos de Mendoza?</h3>
          <p className="respuesta">
            Si. Es la unica guia digital que centraliza y organiza todos los eventos publicos de los 18 departamentos de la provincia.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;
