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
  const [saving, setSaving] = useState(false);

  const [mapCenter, setMapCenter] = useState({ lat: -32.889458, lng: -68.845839 }); // Mendoza
  const autocompleteRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUbicacion((prev) => ({ ...prev, [name]: value }));
  };

  // Cuando el usuario elige una dirección en el Autocomplete de Google
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

    // Validaciones mínimas antes de enviar
    const nombre = ubicacion.nombre?.trim();
    const direccion = ubicacion.direccion?.trim();
    const oasis = ubicacion.oasis?.trim();
    const lat = ubicacion.latitud;
    const lng = ubicacion.longitud;

    if (!nombre || !direccion || !oasis || lat == null || lng == null) {
      alert("Completá nombre, dirección, zona y seleccioná un punto en el mapa.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay sesión activa. Iniciá sesión nuevamente.");
      return;
    }

    // Payload EXACTO que espera el backend (UbicacionDTO)
    const payload = {
      nombre,
      direccion,
      oasis,                  // Debe ser: ZONA_ESTE | GRAN_MENDOZA | VALLE_DE_UCO | OASIS_SUR
      latitud: Number(lat),   // asegurar numérico
      longitud: Number(lng),  // asegurar numérico
      // localidad: (lo omitimos — el DTO la permite nula)
    };

    try {
      setSaving(true);

      const res = await axios.post(`${API}/ubicaciones`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // Si querés que axios solo trate 2xx como éxito:
        validateStatus: (s) => s >= 200 && s < 300,
      });

      console.debug("Ubicación creada:", res.data);
      alert("✅ Ubicación guardada correctamente");

      // Reset del formulario
      setUbicacion({
        nombre: "",
        direccion: "",
        oasis: "",
        latitud: null,
        longitud: null,
      });
      setMapCenter({ lat: -32.889458, lng: -68.845839 });
    } catch (error) {
      // Mostrar detalles útiles si vienen del backend
      const status = error.response?.status;
      const data = error.response?.data;
      console.error("Error al guardar ubicación", status, data || error.message);

      // Mensaje amigable
      if (status === 400) {
        alert("❌ Error 400: Verificá los datos enviados. (¿Zona válida? ¿Lat/Long presentes?)");
      } else if (status === 401 || status === 403) {
        alert("❌ Sesión inválida o sin permisos. Iniciá sesión nuevamente.");
      } else {
        alert("❌ Error al guardar ubicación");
      }
    } finally {
      setSaving(false);
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
              onChange={(e) => setUbicacion((p) => ({ ...p, direccion: e.target.value }))}
              value={ubicacion.direccion}
            />
          </Autocomplete>

          <select name="oasis" value={ubicacion.oasis} onChange={handleChange} required>
            <option value="">Seleccionar ZONA.</option>
            <option value="ZONA_ESTE">Zona Este</option>
            <option value="GRAN_MENDOZA">Gran Mendoza</option>
            <option value="VALLE_DE_UCO">Valle de Uco</option>
            <option value="OASIS_SUR">Zona Sur</option>
          </select>

          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar Ubicación"}
          </button>
        </form>

        {ubicacion.latitud != null && ubicacion.longitud != null && (
          <GoogleMap center={mapCenter} zoom={15} mapContainerStyle={mapContainerStyle}>
            <Marker position={{ lat: Number(ubicacion.latitud), lng: Number(ubicacion.longitud) }} />
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default UbicacionForm;
