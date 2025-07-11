import React from "react";
import { Link } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from "../config/googleMapsConfig";
import "./EventCard.css";

const mapContainerStyle = {
  width: "100%",
  height: "180px",
  marginTop: "10px",
  borderRadius: "12px",
  overflow: "hidden",
};

function EventCard({ event }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  return (
    <div className="event-card">
      <div className="event-img-container">
        <Link to={`/evento/${event.id}`}>
          <img src={event.imagen} alt={event.titulo} className="event-img" />
        </Link>
      </div>

      <div className="event-info">
        <Link to={`/evento/${event.id}`} className="event-title-link">
          <h3>{event.titulo}</h3>
        </Link>
        <p>{event.descripcion}</p>
        <p><strong>📅 Fecha:</strong> {event.fechaInicio} — {event.fechaFin}</p>
        <p><strong>💸 Precio:</strong> ${event.precio}</p>
        <p><strong>🎭 Categoría:</strong> {event.categoriaEvento}</p>
        {event.estado && <p><strong>📌 Estado:</strong> {event.estado}</p>}
        {event.ubicacion?.nombre && (
          <p><strong>📍 Lugar:</strong> {event.ubicacion.nombre}</p>
        )}

        {/* Mapa mini con pin */}
        {isLoaded && event.ubicacion?.latitud && event.ubicacion?.longitud && (
          <GoogleMap
            center={{
              lat: parseFloat(event.ubicacion.latitud),
              lng: parseFloat(event.ubicacion.longitud),
            }}
            zoom={13}
            mapContainerStyle={mapContainerStyle}
          >
            <Marker
              position={{
                lat: parseFloat(event.ubicacion.latitud),
                lng: parseFloat(event.ubicacion.longitud),
              }}
            />
          </GoogleMap>
        )}
      </div>
    </div>
  );
}

export default EventCard;
