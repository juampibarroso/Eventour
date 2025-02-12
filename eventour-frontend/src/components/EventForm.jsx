import { useState } from "react";
import { createEvent } from "../services/Api.js";

function EventForm() {
  const [formData, setFormData] = useState({
    titulo: "",
    description: "",
    date: "",
    location: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvent(formData);
    alert("Evento creado con éxito");
    setFormData({ title: "", description: "", date: "", location: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Título" value={formData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} required />
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      <input type="text" name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} required />
      <button type="submit">Crear Evento</button>
    </form>
  );
}

export default EventForm;
