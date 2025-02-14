import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import "../styles/BusquedaUbicacion.css";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: -32.889458, // Mendoza, Argentina
  lng: -68.845839,
};

const API_KEY = "AIzaSyByF2ZxHZlhvKlUSROh5iL1jrRUJ2ynPaM";

const BusquedaUbicacion = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  const [eventos, setEventos] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    fetch("https://tu-backend.com/api/eventos")
      .then((response) => response.json())
      .then((data) => setEventos(data))
      .catch((error) => console.error("Error al obtener eventos:", error));
  }, []);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setMapCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="busqueda-container">
      <h1 className="titulo-busqueda">Busca eventos por ubicación</h1>
      <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
        <input
          type="text"
          placeholder="Ingresa una ubicación"
          className="input-busqueda"
        />
      </Autocomplete>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={12}>
        {eventos.map((evento) => (
          <Marker
            key={evento.id}
            position={{ lat: evento.ubicacion.latitud, lng: evento.ubicacion.longitud }}
            title={evento.titulo}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default BusquedaUbicacion;