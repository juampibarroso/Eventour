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
            Una guía simple y confiable para enterarte de todos los eventos que pasan en Mendoza. Sin vueltas. Sin perder tiempo.
          </p>
        </div>

        <div className="qa-item">
          <h3 className="pregunta">🎉 ¿Qué vas a encontrar?</h3>
          <p className="respuesta">
            Recitales, charlas, ferias, actividades culturales, deportivas o familiares. Todo en un solo lugar.
          </p>
        </div>

        <div className="qa-item">
          <h3 className="pregunta">👥 ¿Para quién es?</h3>
          <p className="respuesta">
            Para vos, tus amigos, tu familia... y para cualquiera que quiera vivir Mendoza al máximo.
          </p>
        </div>

        <div className="qa-item">
          <h3 className="pregunta">💡 ¿Por qué lo hacemos?</h3>
          <p className="respuesta">
            Porque creemos que la mejor forma de disfrutar es estar bien informado. Y porque amamos esta provincia tanto como vos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;
