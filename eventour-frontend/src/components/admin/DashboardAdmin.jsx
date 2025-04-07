import React, { useEffect, useState } from "react";
import EventForm from "./EventForm";
import EventList from "./EventList";
import "../../styles/Admin.css";

const DashboardAdmin = ({ onLogout }) => {
  const [eventos, setEventos] = useState([]);
  const [eventoActual, setEventoActual] = useState(null);

  // Cargar eventos desde el backend
  const fetchEventos = async () => {
    try {
      const res = await fetch("https://tu-backend.com/api/eventos");
      const data = await res.json();
      setEventos(data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Crear o actualizar evento
  const handleSave = async (evento) => {
    try {
      const res = await fetch(`https://tu-backend.com/api/eventos/${evento.id || ""}`, {
        method: evento.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evento),
      });
      if (res.ok) fetchEventos();
    } catch (error) {
      console.error("Error al guardar evento:", error);
    }
  };

  // Eliminar evento
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;
    try {
      const res = await fetch(`https://tu-backend.com/api/eventos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchEventos();
    } catch (error) {
      console.error("Error al eliminar evento:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <button className="logout-button" onClick={onLogout}>Cerrar sesión</button>
      </div>
      <EventForm onSave={handleSave} eventoActual={eventoActual} setEventoActual={setEventoActual} />
      <EventList eventos={eventos} onEdit={setEventoActual} onDelete={handleDelete} />
    </div>
  );
};

export default DashboardAdmin;
