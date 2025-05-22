import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";

const initialForm = {
  titulo: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  precio: 0,
  imagen: "",
  estado: "ACTIVO",
  ubicacionId: "1", // valor por defecto hasta cargar dinámico
  categoriaEvento: "",
  destacado: false,
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      <select name="categoriaEvento" value={formData.categoriaEvento} onChange={handleChange} required>
        <option value="">Selecciona una categoría</option>
        {categorias.map((cat) => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>
      <select name="ubicacionId" value={formData.ubicacionId} onChange={handleChange} required>
        <option value="">Selecciona una ubicación</option>
        <option value="1">Ubicación 1</option>
        <option value="2">Ubicación 2</option>
        <option value="3">Ubicación 3</option>
      </select>
      <label>
        Destacado:
        <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleChange} />
      </label>
      <button type="submit">{formData.id ? "Actualizar" : "Crear"}</button>
    </form>
  );
};

export default EventForm;