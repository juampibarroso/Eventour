import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";

const initialForm = {
  nombre: "",
  descripcion: "",
  fecha: "",
  categoria: "",
};

const categorias = [
  { value: "DEPORTESYAVENTURA", label: "Deportes y Aventura" },
  { value: "GASTRONOMIAYVINO", label: "Gastronomía y Vino" },
  { value: "FERIASYEXPOSICIONES", label: "Ferias y Exposiciones" },
  { value: "MUSICAYESPECTACULOS", label: "Música y Espectáculos" },
  { value: "ARTEYCULTURA", label: "Arte y Cultura" },
  { value: "CHARLASYEVENTOSEMPRESARIALES", label: "Charlas y Eventos Empresariales" },
];

const EventForm = ({ onSave, eventoActual, setEventoActual }) => {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (eventoActual) {
      setFormData(eventoActual);
    } else {
      setFormData(initialForm);
    }
  }, [eventoActual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData(initialForm);
    setEventoActual(null);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>{formData.id ? "Editar Evento" : "Crear Evento"}</h2>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del evento"
        value={formData.nombre}
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
        name="fecha"
        value={formData.fecha}
        onChange={handleChange}
        required
      />
      <select
        name="categoria"
        value={formData.categoria}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona una categoría</option>
        {categorias.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
      <button type="submit">{formData.id ? "Actualizar" : "Crear"}</button>
    </form>
  );
};

export default EventForm;
