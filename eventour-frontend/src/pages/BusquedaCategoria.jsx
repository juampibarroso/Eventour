import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/BusquedaCategoria.css";

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
  }, []);

  const fetchEventosPorCategoria = (categoria) => {
    fetch(`https://tu-backend.com/api/eventos?categoria=${categoria}`)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((error) => console.error("Error al obtener eventos:", error));
  };

  const handleCategoriaClick = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setBusqueda("");
    setFechaDesde("");
    fetchEventosPorCategoria(categoria);
  };

  const eventosFiltrados = eventos.filter((evento) => {
    const coincideNombre = evento.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFecha = fechaDesde ? new Date(evento.fecha) >= new Date(fechaDesde) : true;
    return coincideNombre && coincideFecha;
  });

  return (
    <div className="busqueda-container">
      <h1 className="titulo">Buscar por Categoría</h1>
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
        <>
          <input
            type="text"
            placeholder="Buscar eventos dentro de la categoría..."
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
        </>
      )}

      <div className="eventos-container">
        {categoriaSeleccionada === "" ? (
          <p className="no-eventos">Elegí una categoría para comenzar.</p>
        ) : eventosFiltrados.length > 0 ? (
          <>
            <h2 className="subtitulo">Eventos encontrados:</h2>
            <div className="eventos-lista">
              {eventosFiltrados.map((evento) => (
                <div
                  key={evento.id}
                  className="evento-card"
                  style={{
                    borderLeft: `5px solid ${coloresPorCategoria[categoriaSeleccionada] || "#999"}`,
                  }}
                >
                  <h3 className="evento-titulo">{evento.nombre}</h3>
                  <p className="evento-descripcion">{evento.descripcion}</p>
                  <p className="evento-fecha">{evento.fecha}</p>
                </div>
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
