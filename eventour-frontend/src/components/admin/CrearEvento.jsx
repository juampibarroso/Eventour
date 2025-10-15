import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const toISO = (v) => {
  if (!v) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [dd, mm, yyyy] = v.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }
  return v;
};
const toNum = (v) => (v === "" ? null : Number(v));

const CrearEvento = () => {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    categoriaId: "",
    ubicacionId: "",
    imagenUrl: "",
    precio: "",
    destacado: false,
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const dto = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        fechaInicio: toISO(form.fechaInicio),
        fechaFin: toISO(form.fechaFin || form.fechaInicio),
        categoriaId: toNum(form.categoriaId),
        ubicacionId: toNum(form.ubicacionId),
        imagenUrl: form.imagenUrl?.trim() || null,
        precio: toNum(form.precio),
        destacado: !!form.destacado,
      };

      const res = await axios.post(`${API}/eventos`, dto, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status >= 200 && res.status < 300) {
        setMensaje("✅ Evento creado con éxito!");
        setForm({
          titulo: "",
          descripcion: "",
          fechaInicio: "",
          fechaFin: "",
          categoriaId: "",
          ubicacionId: "",
          imagenUrl: "",
          precio: "",
          destacado: false,
        });
      } else {
        setMensaje(`⚠️ Respuesta inesperada: ${res.status}`);
      }
    } catch (error) {
      console.error("Error al crear evento", error);
      const detail = error?.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;
      setMensaje(`❌ Error al crear evento: ${detail}`);
      alert(`❌ Error al crear evento:\n\n${detail}`);
    }
  };

  return (
    <div>
      <h2>Crear Evento (simple)</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} required />
        <input type="date" name="fechaFin" value={form.fechaFin} onChange={handleChange} />
        <input type="number" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} />
        <input type="text" name="imagenUrl" placeholder="URL de imagen" value={form.imagenUrl} onChange={handleChange} />
        <input type="number" name="categoriaId" placeholder="ID de categoría" value={form.categoriaId} onChange={handleChange} required />
        <input type="number" name="ubicacionId" placeholder="ID de ubicación (opcional)" value={form.ubicacionId} onChange={handleChange} />
        <label>
          <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} />
          Destacado
        </label>
        <button type="submit">Crear</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default CrearEvento;
