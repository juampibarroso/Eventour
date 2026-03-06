import React, { useState } from "react";
import axios from "axios";

const CrearAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const handleCrearAdmin = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${API}/usuarios/crearAdmin`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      setMensaje(`Admin creado correctamente: ${response.data.username}`);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setMensaje("Error al crear admin");
    }
  };

  return (
    <div>
      <h3>Crear nuevo Admin</h3>
      <form onSubmit={handleCrearAdmin}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Crear Admin</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default CrearAdmin;
