import { useState } from "react";
import { createEvent } from "../services/Api.js";

function EventForm() {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    precio: "",
    imagen: null,
    estado: "ACTIVO", // Estado predeterminado
    destacado: false, // Opción por defecto
    ubicacionId: "", // Este campo es obligatorio en el backend
    categoriaEvento: "" // Este campo también es obligatorio
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      alert("Evento creado con éxito");
      setFormData({
        titulo: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        precio: "",
        imagen: "",
        estado: "ACTIVO",
        destacado: false,
        ubicacionId: "",
        categoriaEvento: ""
      });
    } catch (error) {
      console.error("Error al crear evento:", error);
      alert("Hubo un error al crear el evento");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="titulo" placeholder="Título" value={formData.titulo} onChange={handleChange} required />
      <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} required />
      <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required />
      <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} required />
      <input type="number" name="precio" placeholder="Precio" value={formData.precio} onChange={handleChange} />
      <input type="text" name="imagen" placeholder="URL de la imagen" value={formData.imagen} onChange={handleChange} />
      <select name="estado" value={formData.estado} onChange={handleChange}>
        <option value="ACTIVO">Activo</option>
        <option value="INACTIVO">Inactivo</option>
      </select>
      <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleChange} /> Destacado
      <div>
        <input type="text" name="ubicacionId" placeholder="ID de la Ubicación" value={formData.ubicacionId} onChange={handleChange} required />
      </div>
      <div>
        <input type="text" name="categoriaEvento" placeholder="Categoría" value={formData.categoriaEvento} onChange={handleChange} required />
      </div>
      <button type="submit">Crear Evento</button>
    </form>
  );
}

export default EventForm;
