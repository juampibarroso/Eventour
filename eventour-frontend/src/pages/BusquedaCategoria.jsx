import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "../components/EventCard";
import "../styles/BusquedaCategoria.css";
import "../styles/EventListPage.css"; // Para usar .eventos-grid

const coloresPorCategoria = {
  DEPORTESYAVENTURA: "#09c3dd",
  GASTRONOMIAYVINO: "#f79e1b",
  FERIASYEXPOSICIONES: "#ffd166",
  MUSICAYESPECTACULOS: "#db49fb",
  ARTEYCULTURA: "#4caf50",
  CHARLASYEVENTOSEMPRESARIALES: "#3f51b5",
};

const imagenesPorCategoria = {
  DEPORTESYAVENTURA: "/src/assets/fondos/88.png",
  GASTRONOMIAYVINO: "/src/assets/fondos/33.jpg",
  FERIASYEXPOSICIONES: "/src/assets/fondos/55.jpg",
  MUSICAYESPECTACULOS: "/src/assets/fondos/14.jpg",
  ARTEYCULTURA: "/src/assets/fondos/99.jpg",
  CHARLASYEVENTOSEMPRESARIALES: "/src/assets/fondos/12.jpg",
};

const iconosPorCategoria = {
  DEPORTESYAVENTURA: "fa-person-hiking",
  GASTRONOMIAYVINO: "fa-wine-glass",
  FERIASYEXPOSICIONES: "fa-store",
  MUSICAYESPECTACULOS: "fa-music",
  ARTEYCULTURA: "fa-paint-brush",
  CHARLASYEVENTOSEMPRESARIALES: "fa-briefcase",
};

const BusquedaCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");

  const location = useLocation();

  useEffect(() => {
    const categoriasEnum = Object.keys(coloresPorCategoria).map((cat) => ({
      id: cat,
      nombre: cat,
    }));
    setCategorias(categoriasEnum);

    const params = new URLSearchParams(location.search);
    const categoriaDesdeURL = params.get("categoria");
    if (categoriaDesdeURL) {
      setCategoriaSeleccionada(categoriaDesdeURL);
      fetchEventosPorCategoria(categoriaDesdeURL);
    }
  }, [location.search]);

  const fetchEventosPorCategoria = (categoria) => {
    fetch(`http://localhost:8080/api/eventos?categoria=${categoria}`)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((error) => console.error("Error al obtener eventos:", error));
  };

  const handleCategoriaClick = (categoria) => {
    if (categoria === categoriaSeleccionada) return; // evita recarga innecesaria
    setCategoriaSeleccionada(categoria);
    setBusqueda("");
    setFechaDesde("");
    fetchEventosPorCategoria(categoria);
  };

  const eventosFiltrados = eventos.filter((evento) => {
    const nombre = evento.titulo || evento.nombre || "";
    const fecha = evento.fechaInicio || evento.fecha || "";
    const coincideNombre = nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFecha = fechaDesde ? new Date(fecha) >= new Date(fechaDesde) : true;
    return coincideNombre && coincideFecha;
  });

  return (
    <div className="busqueda-categoria-container">
      <h1 className="titulo-busqueda">Buscar por Categoría</h1>
      <p className="descripcion">
        Navegá entre las categorías y encontrá el evento perfecto para vos.
      </p>

      <div className="categoria-nav">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className={`categoria-card ${categoria.nombre === categoriaSeleccionada ? "activa" : ""}`}
            onClick={() => handleCategoriaClick(categoria.nombre)}
            style={{ borderColor: coloresPorCategoria[categoria.nombre] }}
          >
            <img
              src={imagenesPorCategoria[categoria.nombre]}
              alt={`Imagen de ${categoria.nombre}`}
              className="categoria-card-img"
            />
            <div className="categoria-card-text">
              <i className={`categoria-card-icon fas ${iconosPorCategoria[categoria.nombre]}`} />
              {categoria.nombre.replace(/Y/g, " y ").replace(/([A-Z])/g, " $1").trim()}
            </div>
          </div>
        ))}
      </div>

      {categoriaSeleccionada && (
        <div className="filtros-container">
          <input
            type="text"
            placeholder="Buscar eventos por nombre..."
            className="input-busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <input
            type="date"
            className="input-fecha"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>
      )}

      <div className="eventos-container">
        {categoriaSeleccionada === "" ? (
          <p className="no-eventos">Elegí una categoría para comenzar.</p>
        ) : eventosFiltrados.length > 0 ? (
          <>
            <h2 className="subtitulo">Eventos encontrados:</h2>
            <div className="eventos-grid">
              {eventosFiltrados.map((evento) => (
                <EventCard key={evento.id} event={evento} />
              ))}
            </div>
          </>
        ) : (
          <p className="no-eventos">No hay eventos en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default BusquedaCategoria;
