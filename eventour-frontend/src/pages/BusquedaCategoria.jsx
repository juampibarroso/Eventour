import { useState, useEffect } from "react";
import "../styles/BusquedaCategoria.css"; // Importamos el CSS

const BusquedaCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  // Obtener categorías desde el backend
  useEffect(() => {
    fetch("https://tu-backend.com/api/categorias") // Modifica con la URL real
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  // Manejar el cambio de categoría
  const handleCategoriaChange = (e) => {
    const categoria = e.target.value;
    setCategoriaSeleccionada(categoria);

    if (categoria) {
      fetch(`https://tu-backend.com/api/eventos?categoria=${categoria}`) // Modifica con la URL real
        .then((res) => res.json())
        .then((data) => setEventos(data))
        .catch((error) =>
          console.error("Error al obtener eventos:", error)
        );
    } else {
      setEventos([]);
    }
  };

  return (
    <div className="busqueda-container">
      <h1 className="titulo">Buscar por Categoría</h1>
      <p className="descripcion">Encuentra eventos según su categoría.</p>

      {/* Select para elegir categoría */}
      <select className="select-categoria" value={categoriaSeleccionada} onChange={handleCategoriaChange}>
        <option value="">Selecciona una categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.nombre}>
            {categoria.nombre}
          </option>
        ))}
      </select>

      {/* Mostrar eventos filtrados */}
      <div className="eventos-container">
        <h2 className="subtitulo">Eventos encontrados:</h2>
        {eventos.length > 0 ? (
          <div className="eventos-lista">
            {eventos.map((evento) => (
              <div key={evento.id} className="evento-card">
                <h3 className="evento-titulo">{evento.nombre}</h3>
                <p className="evento-descripcion">{evento.descripcion}</p>
                <p className="evento-fecha">{evento.fecha}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-eventos">No hay eventos en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default BusquedaCategoria;
