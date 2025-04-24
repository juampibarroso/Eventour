import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/BusquedaUbicacion.css";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: -32.889458,
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
  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(userLocation);
        fetchEventos(userLocation.lat, userLocation.lng);
      },
      () => {
        fetchEventos(defaultCenter.lat, defaultCenter.lng);
      }
    );
  }, []);

  const fetchEventos = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await fetch(`https://tu-backend.com/api/eventos/ubicacion?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapCenter(newCenter);
        fetchEventos(newCenter.lat, newCenter.lng);
      }
    }
  };

  if (!isLoaded) return <div className="cargando">Cargando mapa...</div>;

  return (
    <>
      <Navbar />
      <div className="busqueda-container">
        <h1 className="titulo-busqueda">Buscá eventos por ubicación</h1>

        <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
          <input
            type="text"
            placeholder="Ingresá una ubicación"
            className="input-busqueda"
          />
        </Autocomplete>

        <div className="mapa-contenedor">
          <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={12}>
            {eventos.map((evento) => (
              <Marker
                key={evento.id}
                position={{
                  lat: evento.ubicacion.latitud,
                  lng: evento.ubicacion.longitud,
                }}
                title={evento.titulo}
              />
            ))}
          </GoogleMap>
        </div>

        {loading && <p className="mensaje-cargando">Cargando eventos cercanos...</p>}
        {!loading && eventos.length === 0 && <p className="mensaje-vacio">No se encontraron eventos cerca de esta ubicación.</p>}

        {!loading && eventos.length > 0 && (
          <div className="lista-eventos">
            <h2 className="subtitulo-eventos">Eventos cercanos</h2>
            {eventos.map((evento) => (
              <div key={evento.id} className="evento-card">
                <h3>{evento.titulo}</h3>
                <p>{evento.descripcion}</p>
                <p><strong>Fecha:</strong> {new Date(evento.fechaInicio).toLocaleDateString()}</p>
                {evento.distancia && (
                  <p><strong>Distancia:</strong> {evento.distancia.toFixed(1)} km</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BusquedaUbicacion;
