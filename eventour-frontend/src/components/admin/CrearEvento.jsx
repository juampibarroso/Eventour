import React, { useState } from "react";
import axios from "axios";

const CrearEvento = () => {
  const [evento, setEvento] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    ubicacion: "",
    categoria: ""
  });

  const [mensaje, setMensaje] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento({ ...evento, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API}/eventos`, evento, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 ahora sí se interpola correctamente
        },
      });
      setMensaje("Evento creado con éxito!");
    } catch (error) {
      console.error("Error al crear evento", error);
      setMensaje("Error al crear evento");
    }
  };

  return (
    <div>
      <h2>Crear Evento</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="titulo" placeholder="Título" onChange={handleChange} />
        <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} />
        <input type="date" name="fecha" onChange={handleChange} />
        <input type="text" name="ubicacion" placeholder="Ubicación" onChange={handleChange} />
        <input type="text" name="categoria" placeholder="Categoría" onChange={handleChange} />
        <button type="submit">Crear</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default CrearEvento;
