import React, { useState, useRef } from "react";
import { GoogleMap, Marker, LoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import "../../styles/UbicacionForm.css";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from "../../config/googleMapsConfig";

const API = import.meta.env.VITE_API_URL;

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  marginTop: "1rem",
  borderRadius: "12px",
  overflow: "hidden",
};

const UbicacionForm = () => {
  const [ubicacion, setUbicacion] = useState({
    nombre: "",
    direccion: "",
    oasis: "",
    latitud: null,
    longitud: null,
  });

  const [mapCenter, setMapCenter] = useState({ lat: -32.889458, lng: -68.845839 }); // Mendoza
  const autocompleteRef = useRef(null);

  // Maneja cambios en inputs/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUbicacion((prev) => ({ ...prev, [name]: value }));
  };

  // Cuando el usuario elige una dirección de Google
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setUbicacion((prev) => ({
        ...prev,
        direccion: place.formatted_address || prev.direccion,
        latitud: lat,
        longitud: lng,
      }));
      setMapCenter({ lat, lng });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // token guardado al loguear

      await axios.post(`${API}/ubicaciones`, ubicacion, {
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
      console.error("Error al guardar ubicación", error.response?.data || error.message);
      alert("❌ Error al guardar ubicación");
    }
  };

  return (
    <div className="ubicacion-form-container">
      <h2>Cargar Nueva Ubicación</h2>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={GOOGLE_MAPS_LIBRARIES}>
        <form className="ubicacion-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del lugar"
            value={ubicacion.nombre}
            onChange={handleChange}
            required
          />

          <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
            <input
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
              // Permitir escribir manualmente si no se usa el Autocomplete
              onChange={(e) => setUbicacion((p) => ({ ...p, direccion: e.target.value }))}
              value={ubicacion.direccion}
            />
          </Autocomplete>

          {/* OASIS: usa EXACTAMENTE los valores del enum del backend */}
          <select name="oasis" value={ubicacion.oasis} onChange={handleChange} required>
            <option value="">Seleccionar ZONA.</option>
            <option value="ZONA_ESTE">Zona Este</option>
            <option value="GRAN_MENDOZA">Gran Mendoza</option>
            <option value="VALLE_DE_UCO">Valle de Uco</option>
            <option value="OASIS_SUR">Zona Sur</option>
          </select>

          <button type="submit">Guardar Ubicación</button>
        </form>

        {/* Vista previa del mapa */}
        {ubicacion.latitud && (
          <GoogleMap center={mapCenter} zoom={15} mapContainerStyle={mapContainerStyle}>
            <Marker position={{ lat: ubicacion.latitud, lng: ubicacion.longitud }} />
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default UbicacionForm;
