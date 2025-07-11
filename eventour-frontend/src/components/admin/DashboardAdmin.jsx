import React, { useEffect, useState } from "react";
import EventForm from "./EventForm";
import EventList from "./EventList";
import UbicacionForm from "../../components/admin/UbicacionForm"; // ✅ CORREGIDO: solo 1 import
import "../../styles/Admin.css";

const DashboardAdmin = ({ onLogout }) => {
  const [eventos, setEventos] = useState([]);
  const [eventoActual, setEventoActual] = useState(null);

  const fetchEventos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/eventos");
      const data = await res.json();
      setEventos(data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleSave = async (evento) => {
    try {
      const isEdit = !!evento.id;
      const url = isEdit
        ? `http://localhost:8080/api/eventos/${evento.id}`
        : "http://localhost:8080/api/eventos";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evento),
      });
      if (res.ok) fetchEventos();
    } catch (error) {
      console.error("Error al guardar evento:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/eventos/${id}`, {
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

      <section className="admin-section">
        <h2>Cargar Evento</h2>
        <EventForm
          onSave={handleSave}
          eventoActual={eventoActual}
          setEventoActual={setEventoActual}
        />
      </section>

      <section className="admin-section">
        <h2>Lista de Eventos</h2>
        <EventList
          eventos={eventos}
          onEdit={setEventoActual}
          onDelete={handleDelete}
        />
      </section>

      <section className="admin-section">
        <h2>Cargar Ubicación</h2>
        <UbicacionForm />
      </section>
    </div>
  );
};

export default DashboardAdmin;
