// src/components/admin/UbicacionForm.jsx
/* global google */
import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/UbicacionForm.css";
import { Loader } from "@googlemaps/js-api-loader";
import { API_BASE, postJsonWithFallback, getJson, del as httpDelete } from "../../lib/api";
import { OASIS_LABELS, OASIS_ORDER, getAvailableOases, sortLocations } from "../../lib/locations";

export default function UbicacionForm() {
  const [nombre, setNombre] = useState("");
  const [oasis, setOasis] = useState("");
  const [direccion, setDireccion] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [lista, setLista] = useState([]);
  const [busquedaLista, setBusquedaLista] = useState("");
  const [oasisLista, setOasisLista] = useState("");
  const [listaVisible, setListaVisible] = useState(false);

  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstance = useRef(null);
  const listaOrdenada = useMemo(() => sortLocations(lista), [lista]);
  const oasisDisponibles = useMemo(() => getAvailableOases(listaOrdenada), [listaOrdenada]);

  const listaFiltrada = useMemo(() => {
    const q = busquedaLista.trim().toLowerCase();
    return listaOrdenada.filter((location) => {
      const matchesOasis = oasisLista ? location.oasis === oasisLista : true;
      if (!matchesOasis) return false;
      if (!q) return true;

      const haystack = [
        location.nombre,
        location.direccion,
        OASIS_LABELS[location.oasis] || location.oasis,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [busquedaLista, listaOrdenada, oasisLista]);

  const buildFriendlyError = (rawMessage) => {
    if (!rawMessage) {
      return "No se pudo crear la ubicación.";
    }

    if (
      rawMessage.includes('Cannot deserialize value of type') &&
      rawMessage.includes('"CHILE"')
    ) {
      return "El backend que hoy está publicado todavía no acepta la zona CHILE. El frontend ya está listo, pero falta desplegar el backend actualizado para poder guardar ubicaciones de Chile.";
    }

    return "No se pudo crear la ubicación. Detalle: " + rawMessage;
  };

  // === Cargar listado de ubicaciones (para ver/eliminar duplicadas)
  const loadUbicaciones = async () => {
    try {
      const data = await getJson(`${API_BASE}/ubicaciones`, { auth: false });
      setLista(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("GET /ubicaciones error:", e);
    }
  };

  useEffect(() => { loadUbicaciones(); }, []);

  // === Google Maps + Autocomplete (clásico)
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.warn("VITE_GOOGLE_MAPS_API_KEY no configurada");
      return;
    }

    const loader = new Loader({
      apiKey: key,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: -32.889, lng: -68.845 }, // Mendoza
        zoom: 13,
        disableDefaultUI: true,
      });
      mapInstance.current = map;

      markerRef.current = new google.maps.Marker({ map });

      const ac = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ["formatted_address", "geometry", "name"],
        types: ["establishment", "geocode"],
      });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (!place || !place.geometry) return;

        const position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setDireccion(place.formatted_address || "");
        setLat(position.lat.toFixed(6));
        setLng(position.lng.toFixed(6));
        setNombre((current) => current || place.name || "");

        map.panTo(position);
        map.setZoom(16);
        markerRef.current.setPosition(position);
      });
    });
  }, []);

  // === Guardar ubicación (JSON) usando los nombres del UbicacionDTO del backend
  const handleGuardar = async (e) => {
    e.preventDefault();
    setError(""); setOk("");

    const latitud = lat === "" ? null : Number(lat);
    const longitud = lng === "" ? null : Number(lng);

    const payload = {
      id: null,
      nombre: nombre?.trim() || null,
      direccion: direccion?.trim() || null,
      oasis: oasis || null,
      latitud,
      longitud,
    };

    try {
      setCargando(true);
      await postJsonWithFallback(`${API_BASE}/ubicaciones`, payload, { auth: true });
      setOk("✅ Ubicación creada");
      setNombre(""); setDireccion(""); setLat(""); setLng(""); setOasis("");
      if (markerRef.current) markerRef.current.setMap(null);
      loadUbicaciones();
    } catch (e) {
      console.error("Ubicación POST error:", e);
      setError(buildFriendlyError(e.message));
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar esta ubicación?")) return;
    try {
      await httpDelete(`${API_BASE}/ubicaciones/${id}`, { auth: true });
      await loadUbicaciones();
    } catch (e) {
      alert("No se pudo eliminar. " + e.message);
    }
  };

  const getCompactAddress = (location) => {
    if (!location?.direccion) return "Sin dirección";

    const parts = location.direccion
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) return "Sin dirección";
    if (parts.length === 1) return parts[0];

    return `${parts[0]} · ${parts[1]}`;
  };

  return (
    <div className="ubif-card">
      <h2>Cargar Ubicación</h2>

      <form className="ubif-form" onSubmit={handleGuardar}>
        <input
          ref={inputRef}
          className="ubif-input"
          placeholder="Nombre del lugar o dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />

        <select
          className="ubif-input"
          value={oasis}
          onChange={(e) => setOasis(e.target.value)}
        >
          <option value="">Oasis (opcional)</option>
          {OASIS_ORDER.map((o) => (
            <option key={o} value={o}>{OASIS_LABELS[o] || o}</option>
          ))}
        </select>

        <div className="ubif-row">
          <input
            className="ubif-input"
            placeholder="Latitud (opcional)"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            className="ubif-input"
            placeholder="Longitud (opcional)"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>

        <div ref={mapRef} className="ubif-map" />

        <button className="ubif-btn" disabled={cargando}>
          {cargando ? "Guardando…" : "Guardar ubicación"}
        </button>

        {ok && <p className="ubif-ok">{ok}</p>}
        {error && <p className="ubif-err">❌ {error}</p>}
      </form>

      <details className="ubif-panel" open={listaVisible} onToggle={(e) => setListaVisible(e.currentTarget.open)}>
        <summary className="ubif-panel-summary">
          <div>
            <strong>Ubicaciones cargadas</strong>
            <span>{listaFiltrada.length} de {listaOrdenada.length} visibles</span>
          </div>
          <span className="ubif-panel-toggle">{listaVisible ? "Ocultar" : "Mostrar"}</span>
        </summary>

        <div className="ubif-list">
          <div className="ubif-list-head">
            <div>
              <h3>Listado compacto</h3>
              <p className="ubif-list-sub">Buscá rápido, filtrá por zona y abrí solo lo que necesites.</p>
            </div>
            <button className="ubif-mini" type="button" onClick={loadUbicaciones}>Refrescar</button>
          </div>

          <div className="ubif-list-tools">
            <input
              className="ubif-input"
              placeholder="Buscar por nombre o dirección"
              value={busquedaLista}
              onChange={(e) => setBusquedaLista(e.target.value)}
            />

            <select
              className="ubif-input"
              value={oasisLista}
              onChange={(e) => setOasisLista(e.target.value)}
            >
              <option value="">Todas las zonas</option>
              {oasisDisponibles.map((value) => (
                <option key={value} value={value}>{OASIS_LABELS[value] || value}</option>
              ))}
            </select>
          </div>

          {listaFiltrada.length === 0 ? (
            <p className="ubif-empty">No hay ubicaciones para ese filtro.</p>
          ) : (
            listaFiltrada.map((u) => (
              <details key={u.id} className="ubif-item">
                <summary className="ubif-item-summary">
                  <div className="ubif-item-main">
                    <strong>{u.nombre || "Ubicación sin nombre"}</strong>
                    <span>{getCompactAddress(u)}</span>
                  </div>

                  <div className="ubif-item-side">
                    {u.oasis && (
                      <span className="ubif-chip">{OASIS_LABELS[u.oasis] || u.oasis}</span>
                    )}
                    <button
                      type="button"
                      className="ubif-del"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEliminar(u.id);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </summary>

                <div className="ubif-item-details">
                  <p>{u.direccion || "Sin dirección completa"}</p>
                  <small>
                    {(u.latitud != null && u.longitud != null)
                      ? `Lat ${u.latitud} · Lng ${u.longitud}`
                      : "Sin coordenadas"}
                  </small>
                </div>
              </details>
            ))
          )}
        </div>
      </details>
    </div>
  );
}
