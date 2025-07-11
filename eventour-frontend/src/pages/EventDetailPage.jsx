import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/EventDetailPage.css";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from "../config/googleMapsConfig";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  marginTop: "20px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
};

const EventDetailPage = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/eventos/${id}`)
      .then((res) => res.json())
      .then((data) => setEvento(data))
      .catch((err) => console.error("Error al cargar el evento", err));
  }, [id]);

  if (!evento) return <p className="cargando-evento">Cargando evento...</p>;

  return (
    <div className="evento-detalle-container">
      <div className="evento-banner">
        {evento.imagen && <img src={evento.imagen} alt={evento.titulo} />}
      </div>
      <div className="evento-detalle-contenido">
        <h1>{evento.titulo.toUpperCase()}.</h1>
        <hr className="evento-divider" />

        {evento.descripcion && (
          <p className="evento-descripcion">{evento.descripcion}</p>
        )}

        <div className="evento-datos">
          {evento.fechaInicio && evento.fechaFin && (
            <p>📅 <strong>Fecha:</strong> {evento.fechaInicio} — {evento.fechaFin}</p>
          )}
          {typeof evento.precio === "number" && (
            <p>💸 <strong>Precio:</strong> ${evento.precio}</p>
          )}
          {typeof evento.estado === "string" && (
            <p>📌 <strong>Estado:</strong> {evento.estado}</p>
          )}

          {/* Ubicación textual */}
          {evento.ubicacion && (
            <>
              <p>📍 <strong>Lugar:</strong> {evento.ubicacion.nombre}</p>
              <p>🌆 <strong>Localidad:</strong> {evento.ubicacion.localidad}</p>
              <p>🗺️ <strong>Oasis:</strong> {evento.ubicacion.oasis}</p>
            </>
          )}
        </div>

        {/* Mapa con pin */}
        {isLoaded && evento.ubicacion?.latitud && evento.ubicacion?.longitud && (
          <div className="evento-mapa-container">
            <h3>🗺️ Mapa del Evento</h3>
            <GoogleMap
              center={{
                lat: parseFloat(evento.ubicacion.latitud),
                lng: parseFloat(evento.ubicacion.longitud),
              }}
              zoom={14}
              mapContainerStyle={mapContainerStyle}
            >
              <Marker
                position={{
                  lat: parseFloat(evento.ubicacion.latitud),
                  lng: parseFloat(evento.ubicacion.longitud),
                }}
              />
            </GoogleMap>
          </div>
        )}

        <Link to="/" className="volver-link">← Volver a eventos</Link>
      </div>
    </div>
  );
};

export default EventDetailPage;
