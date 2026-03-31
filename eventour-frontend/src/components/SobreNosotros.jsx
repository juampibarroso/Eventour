import "../styles/SobreNosotros.css";
import stageBg from "../assets/33.jpg";

const qaItems = [
  {
    question: "¿Qué es Eventour?",
    answer:
      "Una plataforma digital que centraliza y organiza eventos de Mendoza y, progresivamente, también de Chile para que descubrir planes sea simple y confiable.",
  },
  {
    question: "¿Cómo puedo buscar eventos?",
    answer:
      "Podés explorar por ubicación, categoría, fecha o ir directo a los destacados. La idea es que siempre tengas una forma rápida de encontrar algo que encaje con vos.",
  },
  {
    question: "¿La información es confiable?",
    answer:
      "Sí. Trabajamos con eventos provenientes de organizadores, instituciones y fuentes verificadas para ofrecer datos más claros, actuales y útiles.",
  },
  {
    question: "¿Qué valor agrega Eventour?",
    answer:
      "No solo listamos eventos: los ordenamos, los hacemos comparables y te damos una experiencia visual que ayuda a decidir más rápido qué hacer.",
  },
];

const SobreNosotros = () => {
  return (
    <section className="sobre-nosotros-section" id="sobre-nosotros">
      <div
        className="sobre-stage"
        style={{ "--sobre-stage-bg": `url(${stageBg})` }}
      >
        <div className="sobre-head">
          <span className="sobre-kicker">Sobre Eventour</span>
          <h2 className="sobre-titulo">Una guía visual para descubrir mejores salidas</h2>
          <p className="sobre-sub">
            Centralizamos experiencias, facilitamos la búsqueda y tratamos cada evento como una
            propuesta que merece verse bien y entenderse rápido.
          </p>
        </div>

        <div className="qa-container">
          {qaItems.map((item, index) => (
            <div key={item.question} className="qa-item">
              <span className="qa-index">0{index + 1}</span>
              <h3 className="pregunta">{item.question}</h3>
              <p className="respuesta">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;
