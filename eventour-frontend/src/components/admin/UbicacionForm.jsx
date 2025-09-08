import React, { useRef, useState } from "react";
import { LoadScript, Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";
import "../../styles/UbicacionForm.css";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from "../../config/googleMapsConfig";

const API = import.meta.env.VITE_API_URL;

const mapContainerStyle = {
  width: "100%",
  height: "320px",
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

  // centro inicial Mendoza
  const [mapCenter, setMapCenter] = useState({ lat: -32.889458, lng: -68.845839 });

  // referencia al widget de Autocomplete
  const autocompleteRef = useRef(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setUbicacion((prev) => ({ ...prev, [name]: value }));
  };

  // cuando el usuario selecciona una sugerencia del Autocomplete
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setUbicacion((prev) => ({
      ...prev,
      direccion: place.formatted_address || prev.direccion,
      latitud: lat,
      longitud: lng,
    }));
    setMapCenter({ lat, lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validación: obligamos a tener coords (para evitar 400 del backend)
    if (
      !ubicacion.nombre.trim() ||
      !ubicacion.direccion.trim() ||
      !ubicacion.oasis ||
      ubicacion.latitud == null ||
      ubicacion.longitud == null
    ) {
      alert("Completá nombre, dirección, zona y seleccioná una dirección del Autocomplete (para obtener lat/lng).");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(`${API}/ubicaciones`, ubicacion, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Ubicación guardada");
      // limpiar
      setUbicacion({
        nombre: "",
        direccion: "",
        oasis: "",
        latitud: null,
        longitud: null,
      });
      setMapCenter({ lat: -32.889458, lng: -68.845839 });
      console.log("Nueva ubicación:", res.data);
    } catch (err) {
      console.error("Error al guardar ubicación:", err.response?.data || err.message);
      alert("❌ Error al guardar ubicación. Revisá la consola para más detalles.");
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
            onChange={onChange}
            required
          />

          {/* Autocomplete: al elegir una sugerencia se setean direccion + lat/lng */}
          <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
            <input
              type="text"
              placeholder="Buscar dirección"
              className="autocomplete-input"
              value={ubicacion.direccion}
              onChange={(e) => setUbicacion((p) => ({ ...p, direccion: e.target.value }))}
              style={{
                width: "100%",
                height: 40,
                padding: "10px",
                borderRadius: 8,
                border: "1px solid #444",
                marginBottom: 10,
                color: "#eee",
                background: "#1f1f1f",
              }}
            />
          </Autocomplete>

          <select name="oasis" value={ubicacion.oasis} onChange={onChange} required>
            <option value="">Seleccionar ZONA</option>
            <option value="ZONA_ESTE">Zona Este</option>
            <option value="GRAN_MENDOZA">Gran Mendoza</option>
            <option value="VALLE_DE_UCO">Valle de Uco</option>
            <option value="OASIS_SUR">Zona Sur</option>
          </select>

          <button type="submit">Guardar Ubicación</button>
        </form>

        {/* Mapa de vista previa sólo si hay coords */}
        {ubicacion.latitud != null && ubicacion.longitud != null && (
          <GoogleMap center={mapCenter} zoom={15} mapContainerStyle={mapContainerStyle}>
            <Marker position={{ lat: ubicacion.latitud, lng: ubicacion.longitud }} />
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default UbicacionForm;
