import { Link } from "react-router-dom";
import "../styles/BusquedaRapida.css";
import stageBg from "../assets/88.png";

const links = [
  {
    to: "/busqueda-ubicacion",
    className: "ubicacion",
    icon: "fas fa-map-marker-alt",
    eyebrow: "Explorá por zona",
    title: "Ubicaciones",
    description: "Encontrá eventos por zona o lugar.",
    action: "Explorar lugares",
  },
  {
    to: "/busqueda-categoria",
    className: "categoria",
    icon: "fas fa-tags",
    eyebrow: "Elegí una temática",
    title: "Categorías",
    description: "Elegí el tipo de evento que querés ver.",
    action: "Ver categorías",
  },
  {
    to: "/busqueda-fecha",
    className: "fecha",
    icon: "fas fa-calendar-alt",
    eyebrow: "Ordená tu agenda",
    title: "Fechas",
    description: "Buscá por día o por rango de fechas.",
    action: "Elegir fecha",
  },
  {
    to: "/eventos-destacados",
    className: "destacados",
    icon: "fas fa-star",
    eyebrow: "Imperdibles",
    title: "Destacados",
    description: "Mirá una selección de eventos recomendados.",
    action: "Ver selección",
  },
];

const BusquedaRapida = () => {
  return (
    <section className="busqueda-rapida-section" id="buscar-eventos">
      <div className="busqueda-head">
        <h2 className="busqueda-titulo">¿Qué querés explorar?</h2>
      </div>

      <div
        className="busqueda-stage"
        style={{ "--busqueda-stage-bg": `url(${stageBg})` }}
      >
        <div className="busqueda-grid">
          {links.map((item) => (
            <Link key={item.to} to={item.to} className={`busqueda-card ${item.className}`}>
              <div className="busqueda-card-top">
                <span className="busqueda-eyebrow">{item.eyebrow}</span>
                <i className={`${item.icon} icono`} />
              </div>

              <div className="busqueda-copy">
                <h3 className="busqueda-label">{item.title}</h3>
                <p className="busqueda-desc">{item.description}</p>
              </div>

              <span className="busqueda-action">{item.action}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusquedaRapida;
