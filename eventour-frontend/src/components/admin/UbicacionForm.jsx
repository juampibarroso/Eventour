import { useState, useRef, useCallback } from "react";
import axios from "axios";

// --- DEBES REEMPLAZAR ESTAS LÍNEAS CON TU INFORMACIÓN ---
const API = import.meta.env.VITE_API_URL;
const GOOGLE_MAPS_API_KEY = "AIzaSyByF2ZxHZlhvKlUSROh5iL1jrRUJ2ynPaM"; 
// --------------------------------------------------------

const UbicacionForm = () => {
  const [ubicacion, setUbicacion] = useState({
    nombre: "",
    direccion: "",
    oasis: "",
    latitud: null,
    longitud: null,
  });

  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const autocompleteInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUbicacion((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      
      const ubicacionPayload = {
        nombre: ubicacion.nombre,
        direccion: ubicacion.direccion,
        oasis: ubicacion.oasis,
        latitud: ubicacion.latitud ? Number(ubicacion.latitud) : null,
        longitud: ubicacion.longitud ? Number(ubicacion.longitud) : null,
      };

      console.log("Ubicación que se envía:", JSON.stringify(ubicacionPayload, null, 2));
      
      const response = await axios.post(`${API}/ubicaciones`, ubicacionPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Ubicación guardada correctamente");
      setUbicacion({
        nombre: "",
        direccion: "",
        oasis: "",
        latitud: null,
        longitud: null,
      });
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      alert("❌ Error al guardar ubicación");
    }
  };

  return (
    <div className="ubicacion-form-container">
      <h2>Cargar Nueva Ubicación</h2>
      <form className="ubicacion-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del lugar"
          value={ubicacion.nombre}
          onChange={handleChange}
          required
        />
        <input
          ref={autocompleteInputRef}
          type="text"
          placeholder="Buscar dirección"
          className="autocomplete-input"
          style={{
            width: "100%",
            height: "40px",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            marginBottom: "10px",
          }}
          onChange={(e) => setUbicacion((p) => ({ ...p, direccion: e.target.value }))}
          value={ubicacion.direccion}
        />
        <select name="oasis" value={ubicacion.oasis} onChange={handleChange} required>
          <option value="">Seleccionar ZONA.</option>
          <option value="ZONA_ESTE">Zona Este</option>
          <option value="GRAN_MENDOZA">Gran Mendoza</option>
          <option value="VALLE_DE_UCO">Valle de Uco</option>
          <option value="OASIS_SUR">Zona Sur</option>
        </select>
        <button type="submit">Guardar Ubicación</button>
      </form>
    </div>
  );
};

export default UbicacionForm;