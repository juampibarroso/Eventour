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
    
    // Validación básica
    if (!ubicacion.nombre || !ubicacion.direccion || !ubicacion.oasis) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      
      // Crear payload de forma muy explícita
      const ubicacionPayload = {
        nombre: ubicacion.nombre.trim(),
        direccion: ubicacion.direccion.trim(),
        oasis: ubicacion.oasis,
        latitud: ubicacion.latitud ? parseFloat(ubicacion.latitud) : null,
        longitud: ubicacion.longitud ? parseFloat(ubicacion.longitud) : null,
      };

      console.log("=== DATOS A ENVIAR ===");
      console.log("Token:", token ? "✅ Presente" : "❌ No encontrado");
      console.log("API URL:", `${API}/ubicaciones`);
      console.log("Payload:", JSON.stringify(ubicacionPayload, null, 2));
      console.log("=====================");
      
      // Configuración muy explícita de axios
      const config = {
        method: 'POST',
        url: `${API}/ubicaciones`,
        data: ubicacionPayload,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      console.log("Config de axios:", config);
      
      const response = await axios(config);
      
      console.log("✅ Respuesta exitosa:", response.data);
      alert("✅ Ubicación guardada correctamente");
      
      // Reset form
      setUbicacion({
        nombre: "",
        direccion: "",
        oasis: "",
        latitud: null,
        longitud: null,
      });
      
    } catch (error) {
      console.error("=== ERROR COMPLETO ===");
      console.error("Error:", error);
      console.error("Message:", error.message);
      console.error("Response:", error.response);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("Headers enviados:", error.config?.headers);
      console.error("Data enviada:", error.config?.data);
      console.error("====================");
      alert(`❌ Error al guardar ubicación: ${error.response?.data?.message || error.message}`);
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