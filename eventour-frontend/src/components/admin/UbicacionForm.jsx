import React, { useState, useRef, useEffect } from "react";
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
    localidad: "",
    latitud: null,
    longitud: null,
  });

  const [mapCenter, setMapCenter] = useState({ lat: -32.889458, lng: -68.845839 }); // Mendoza
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setUbicacion((prev) => ({
        ...prev,
        direccion: place.formatted_address,
        latitud: lat,
        longitud: lng,
      }));
      setMapCenter({ lat, lng });
    }
  };

  const handleChange = (e) => {
    setUbicacion({ ...ubicacion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/ubicaciones`, ubicacion);

      alert("✅ Ubicación guardada correctamente");
      setUbicacion({
        nombre: "",
        direccion: "",
        oasis: "",
        localidad: "",
        latitud: null,
        longitud: null,
      });
    } catch (error) {
      console.error("Error al guardar ubicación", error);
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
            />
          </Autocomplete>

          <select name="oasis" value={ubicacion.oasis} onChange={handleChange} required>
            <option value="">Seleccionar oasis</option>
            <option value="OASIS_SUR">Oasis Sur</option>
            <option value="VALLE_DE_UCO">Valle de Uco</option>
            <option value="OASIS_NORTE">Oasis Norte</option>
            <option value="OASIS_ESTE">Oasis Este</option>
          </select>

          <select name="localidad" value={ubicacion.localidad} onChange={handleChange} required>
            <option value="">Seleccionar localidad</option>
            <option value="SAN RAFAEL">San Rafael</option>
            <option value="GENERAL ALVEAR">General Alvear</option>
            <option value="MALARGÜE">Malargüe</option>
            <option value="LUJÁN DE CUYO">Luján de Cuyo</option>
            <option value="GODOY CRUZ">Godoy Cruz</option>
            <option value="GUAYMALLÉN">Guaymallén</option>
            <option value="LAS HERAS">Las Heras</option>
            <option value="MAIPÚ">Maipú</option>
            <option value="TUNUYÁN">Tunuyán</option>
            <option value="TUPUNGATO">Tupungato</option>
            <option value="SAN CARLOS">San Carlos</option>
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
