import { useState, useEffect } from "react";
import "../styles/BusquedaCategoria.css";

const coloresPorCategoria = {
  Música: "#db49fb",
  Deportes: "#09c3dd",
  Gastronomía: "#f79e1b",
  Cultura: "#4caf50",
  Tecnología: "#3f51b5",
  Otros: "#9e9e9e",
};

const BusquedaCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("https://tu-backend.com/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  const handleCategoriaChange = (e) => {
    const categoria = e.target.value;
    setCategoriaSeleccionada(categoria);
    setBusqueda(""); // Limpiar búsqueda al cambiar de categoría

    if (categoria) {
      fetch(`https://tu-backend.com/api/eventos?categoria=${categoria}`)
        .then((res) => res.json())
        .then((data) => setEventos(data))
        .catch((error) => console.error("Error al obtener eventos:", error));
    } else {
      setEventos([]);
    }
  };

  const eventosFiltrados = eventos.filter((evento) =>
    evento.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="busqueda-container">
      <h1 className="titulo">Buscar por Categoría</h1>
      <p className="descripcion">Encuentra eventos según su categoría.</p>

      <select
        className="select-categoria"
        value={categoriaSeleccionada}
        onChange={handleCategoriaChange}
      >
        <option value="">Selecciona una categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.nombre}>
            {categoria.nombre}
          </option>
        ))}
      </select>

      {categoriaSeleccionada && (
        <input
          type="text"
          placeholder="Buscar eventos dentro de la categoría..."
          className="input-busqueda"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      )}

      <div className="eventos-container">
        {categoriaSeleccionada === "" ? (
          // Agrupado por categoría si no se selecciona ninguna
          Object.keys(coloresPorCategoria).map((categoria) => {
            const eventosDeCategoria = eventos.filter(
              (e) => e.categoria === categoria
            );
            if (eventosDeCategoria.length === 0) return null;

            return (
              <div key={categoria} className="categoria-bloque">
                <h2
                  className="categoria-titulo"
                  style={{ color: coloresPorCategoria[categoria] }}
                >
                  {categoria}
                </h2>
                <div className="eventos-lista">
                  {eventosDeCategoria.map((evento) => (
                    <div
                      key={evento.id}
                      className="evento-card"
                      style={{
                        borderLeft: `5px solid ${coloresPorCategoria[categoria]}`,
                      }}
                    >
                      <h3 className="evento-titulo">{evento.nombre}</h3>
                      <p className="evento-descripcion">
                        {evento.descripcion}
                      </p>
                      <p className="evento-fecha">{evento.fecha}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <>
            <h2 className="subtitulo">Eventos encontrados:</h2>
            {eventosFiltrados.length > 0 ? (
              <div className="eventos-lista">
                {eventosFiltrados.map((evento) => (
                  <div
                    key={evento.id}
                    className="evento-card"
                    style={{
                      borderLeft: `5px solid ${
                        coloresPorCategoria[categoriaSeleccionada] || "#999"
                      }`,
                    }}
                  >
                    <h3 className="evento-titulo">{evento.nombre}</h3>
                    <p className="evento-descripcion">
                      {evento.descripcion}
                    </p>
                    <p className="evento-fecha">{evento.fecha}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-eventos">No hay eventos en esta categoría.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BusquedaCategoria;
