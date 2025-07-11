import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import "../../styles/Admin.css";

const categorias = [
  { value: "DEPORTESYAVENTURA", label: "Deportes y Aventura" },
  { value: "GASTRONOMIAYVINO", label: "Gastronomía y Vino" },
  { value: "FERIASYEXPOSICIONES", label: "Ferias y Exposiciones" },
  { value: "MUSICAYESPECTACULOS", label: "Música y Espectáculos" },
  { value: "ARTEYCULTURA", label: "Arte y Cultura" },
  { value: "CHARLASYEVENTOSEMPRESARIALES", label: "Charlas y Eventos Empresariales" },
];

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  marginTop: "20px",
  borderRadius: "12px",
};

const initialForm = {
  titulo: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  precio: 0,
  imagen: "",
  estado: "ACTIVO",
  ubicacionId: "",
  categoriaEvento: "",
  destacado: false,
};

const EventForm = ({ onSave, eventoActual, setEventoActual }) => {
  const [formData, setFormData] = useState(initialForm);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);

  useEffect(() => {
    if (eventoActual) {
      setFormData(eventoActual);
    } else {
      setFormData(initialForm);
    }
  }, [eventoActual]);

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/ubicaciones");
        const data = await res.json();
        setUbicaciones(data);

        // Si estamos editando un evento, buscá la ubicación actual y seteala
        if (eventoActual?.ubicacion?.id) {
          const ubicacion = data.find((u) => u.id === eventoActual.ubicacion.id);
          if (ubicacion) {
            setUbicacionSeleccionada(ubicacion);
          }
        }
      } catch (error) {
        console.error("Error al cargar ubicaciones:", error);
      }
    };

    fetchUbicaciones();
  }, [eventoActual]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const updatedValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Mostrar ubicación en el mapa si se cambia
    if (name === "ubicacionId") {
      const ubi = ubicaciones.find((u) => u.id.toString() === value);
      setUbicacionSeleccionada(ubi || null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData(initialForm);
    setUbicacionSeleccionada(null);
    setEventoActual(null);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>{formData.id ? "Editar Evento" : "Crear Evento"}</h2>

      <input
        type="text"
        name="titulo"
        placeholder="Título del evento"
        value={formData.titulo}
        onChange={handleChange}
        required
      />
      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={formData.descripcion}
        onChange={handleChange}
        required
      ></textarea>

      <input
        type="date"
        name="fechaInicio"
        value={formData.fechaInicio}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="fechaFin"
        value={formData.fechaFin}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={formData.precio}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="imagen"
        placeholder="URL de imagen (opcional)"
        value={formData.imagen}
        onChange={handleChange}
      />

      <select
        name="categoriaEvento"
        value={formData.categoriaEvento}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona una categoría</option>
        {categorias.map((cat) => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>

      <select
        name="ubicacionId"
        value={formData.ubicacionId}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona una ubicación</option>
        {ubicaciones.map((ubi) => (
          <option key={ubi.id} value={ubi.id}>
            {ubi.nombre} ({ubi.localidad})
          </option>
        ))}
      </select>

      {/* Mostrar mapa si hay coordenadas */}
      {ubicacionSeleccionada?.latitud && ubicacionSeleccionada?.longitud && (
        <LoadScript googleMapsApiKey="AIzaSyByF2ZxHZlhvKlUSROh5iL1jrRUJ2ynPaM">
          <div className="mapa-preview">
            <GoogleMap
              center={{
                lat: parseFloat(ubicacionSeleccionada.latitud),
                lng: parseFloat(ubicacionSeleccionada.longitud),
              }}
              zoom={14}
              mapContainerStyle={mapContainerStyle}
            >
              <Marker
                position={{
                  lat: parseFloat(ubicacionSeleccionada.latitud),
                  lng: parseFloat(ubicacionSeleccionada.longitud),
                }}
              />
            </GoogleMap>
          </div>
        </LoadScript>
      )}

      <label>
        Destacado:
        <input
          type="checkbox"
          name="destacado"
          checked={formData.destacado}
          onChange={handleChange}
        />
      </label>

      <button type="submit">{formData.id ? "Actualizar" : "Crear"}</button>
    </form>
  );
};

export default EventForm;
