import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function UbicacionesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/ubicaciones`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("× Error listando ubicaciones:", e);
      setMsg("No se pudieron cargar las ubicaciones.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta ubicación?")) return;
    try {
      const res = await fetch(`${API_BASE}/ubicaciones/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
      setItems((s) => s.filter((it) => it.id !== id));
    } catch (e) {
      console.error("× Error eliminando ubicación:", e);
      alert("No se pudo eliminar la ubicación.");
    }
  }

  return (
    <section className="admin-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}>Ubicaciones cargadas</h3>
        <button onClick={load} style={{ fontSize: 14 }}>Refrescar</button>
      </div>

      {loading && <p style={{ opacity: .8 }}>Cargando…</p>}
      {!loading && msg && <p style={{ color: "#ff7b7b" }}>{msg}</p>}

      {!loading && !msg && items.length === 0 && (
        <p style={{ opacity: .8 }}>No hay ubicaciones cargadas.</p>
      )}

      <div style={{ display: "grid", gap: 8 }}>
        {items.map((u) => (
          <div
            key={u.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 10,
              background: "linear-gradient(180deg, #17171a 0%, #101013 100%)",
              border: "1px solid rgba(219,73,251,.22)",
            }}
          >
            <div style={{ lineHeight: 1.35 }}>
              <div style={{ fontWeight: 700 }}>{u.nombre}</div>
              <div style={{ opacity: .8, fontSize: 13 }}>{u.direccion}</div>
              <div style={{ opacity: .7, fontSize: 12 }}>
                {u.latitud != null && u.longitud != null
                  ? `(${u.latitud.toFixed?.(6) ?? u.latitud}, ${u.longitud.toFixed?.(6) ?? u.longitud})`
                  : "Sin coordenadas"}
              </div>
            </div>
            <button
              onClick={() => handleDelete(u.id)}
              style={{
                background: "#ff4d6d",
                border: 0,
                color: "#fff",
                padding: "8px 10px",
                borderRadius: 8,
                cursor: "pointer",
              }}
              title="Eliminar"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
