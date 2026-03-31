// src/components/admin/EventForm.jsx
import { useEffect, useMemo, useState } from "react";
import { API_BASE, getJson } from "../../lib/api";
import { normalizeTicketUrl } from "../../lib/eventDisplay";
import { OASIS_LABELS, getAvailableOases, filterLocationsByOasis } from "../../lib/locations";

const CATEGORIAS = [
  "DEPORTESYAVENTURA",
  "GASTRONOMIAYVINO",
  "FERIASYEXPOSICIONES",
  "MUSICAYESPECTACULOS",
  "ARTEYCULTURA",
  "CHARLASYEVENTOSEMPRESARIALES",
];

const DESCRIPTION_LIMIT = 60000;

const initial = {
  titulo: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  linkEntradas: "",
  imagenUrl: "",
  categoria: "",
  destacado: false,
  ubicacionId: "",
};

export default function EventForm({ onSaved }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loadingUbic, setLoadingUbic] = useState(false);
  const [ubicacionOasis, setUbicacionOasis] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoadingUbic(true);
        const data = await getJson(`${API_BASE}/ubicaciones`, { auth: false });
        setUbicaciones(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("GET /ubicaciones error:", e);
        setUbicaciones([]);
      } finally {
        setLoadingUbic(false);
      }
    })();
  }, []);

  const oasisDisponibles = useMemo(
    () => getAvailableOases(ubicaciones),
    [ubicaciones]
  );

  const ubicacionesFiltradas = useMemo(
    () => filterLocationsByOasis(ubicaciones, ubicacionOasis),
    [ubicaciones, ubicacionOasis]
  );

  useEffect(() => {
    setForm((current) => {
      if (!current.ubicacionId) return current;
      const exists = ubicacionesFiltradas.some((u) => String(u.id) === String(current.ubicacionId));
      return exists ? current : { ...current, ubicacionId: "" };
    });
  }, [ubicacionesFiltradas]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onTicketBlur = () => {
    setForm((s) => {
      const normalized = normalizeTicketUrl(s.linkEntradas);
      return normalized ? { ...s, linkEntradas: normalized } : s;
    });
  };

  const descriptionLength = form.descripcion.length;
  const remainingDescription = DESCRIPTION_LIMIT - descriptionLength;

  // ====== payload con ALIASES de imagen y categoría (compat) ======
  const buildPayload = () => {
    const img = (form.imagenUrl || "").trim();
    const cat = form.categoria ? String(form.categoria).toUpperCase() : "";
    const ticketUrl = normalizeTicketUrl(form.linkEntradas) || "";

    const common = {
      titulo: form.titulo?.trim(),
      descripcion: form.descripcion?.trim() || "",
      fechaInicio: form.fechaInicio || null,
      fechaFin: form.fechaFin || form.fechaInicio || null,
      precio: 0,
      linkEntradas: ticketUrl,
      destacado: !!form.destacado,
      // ubicación (los dos nombres más típicos)
      ubicacionId: form.ubicacionId ? Number(form.ubicacionId) : undefined,
      "ubicacion.id": form.ubicacionId ? Number(form.ubicacionId) : undefined,
    };

    // Evitamos mandar strings vacíos para que no las pise con ''
    const withIf = (obj) =>
      Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
      );

    return withIf({
      ...common,

      // IMAGEN: múltiples aliases
      imagenUrl: img,
      imagen: img,
      urlImagen: img,
      imageUrl: img,
      imagenPrincipal: img,

      // CATEGORÍA: múltiples aliases (string ENUM en tu DB)
      categoria: cat,
      categoriaEvento: cat,
      categoriaNombre: cat,
      category: cat,
    });
  };

  // ----- POST formatos -----
  const postFormUrlEncoded = async (payload) => {
    const token = localStorage.getItem("token") || "";
    const sp = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => sp.append(k, String(v)));
    return fetch(`${API_BASE}/eventos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: sp.toString(),
    });
  };

  const postJSON = async (payload) => {
    const token = localStorage.getItem("token") || "";
    return fetch(`${API_BASE}/eventos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  };

  const postMultipart = async (payload) => {
    const token = localStorage.getItem("token") || "";
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v)));
    return fetch(`${API_BASE}/eventos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: fd,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      const payload = buildPayload();
      console.log("POST /eventos payload:", payload);

      // ⚠️ Prioridad a x-www-form-urlencoded (suele mapear mejor en backends que guardan categoria)
      let res = await postFormUrlEncoded(payload);
      if (!res.ok) {
        const txt1 = await res.text();
        // fallback: JSON
        res = await postJSON(payload);
        if (!res.ok) {
          const txt2 = await res.text();
          // último recurso: multipart
          res = await postMultipart(payload);
          if (!res.ok) {
            const txt3 = await res.text();
            throw new Error(
              `POST /eventos falló.\nFormUrlEncoded: ${txt1}\nJSON: ${txt2}\nMultipart: ${txt3}`
            );
          }
        }
      }

      setMsg("✅ Evento creado con éxito");
      setForm(initial);
      if (typeof onSaved === "function") onSaved();
    } catch (err) {
      console.error("POST /eventos error:", err);
      setMsg("❌ No se pudo crear el evento");
    } finally {
      setSaving(false);
    }
  };

  const preview = form.imagenUrl?.trim() || "/assets/bannernegro-cXfYfe60.jpg";

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Cargar Evento</h2>

      <form className="admin-form" onSubmit={onSubmit}>
        <input
          name="titulo"
          placeholder="Título del evento"
          value={form.titulo}
          onChange={onChange}
          required
        />

        <textarea
          name="descripcion"
          placeholder="Descripción completa del evento"
          value={form.descripcion}
          onChange={onChange}
          maxLength={DESCRIPTION_LIMIT}
          rows={8}
          style={{ minHeight: 160, resize: "vertical" }}
        />
        <div className="admin-field-hint">
          <span>{descriptionLength} / {DESCRIPTION_LIMIT} caracteres</span>
          <span>{remainingDescription} disponibles</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <span>Fecha inicio</span>
            <input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={onChange}
              required
            />
          </label>
          <label>
            <span>Fecha fin</span>
            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={onChange}
            />
          </label>
        </div>

        <label>
          <span>Link de entradas (opcional)</span>
          <input
            type="text"
            name="linkEntradas"
            placeholder="https://..."
            value={form.linkEntradas}
            onChange={onChange}
            onBlur={onTicketBlur}
            inputMode="url"
          />
        </label>

        <label className="img-field">
          <span className="img-label">Imagen (URL completa)</span>
          <input
            name="imagenUrl"
            placeholder="https://…"
            value={form.imagenUrl}
            onChange={onChange}
          />
          <small className="img-or">
            Formato recomendado: JPG/PNG/WEBP. Evitá sitios que bloquean hotlink.
          </small>
          <div className="img-preview">
            <img
              src={preview}
              alt="preview"
              style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 8 }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/bannernegro-cXfYfe60.jpg";
              }}
            />
          </div>
        </label>

        {/* SELECT sin cambios visuales, pero el value queda en UPPERCASE */}
        <label>
          <span>Categoría (opcional)</span>
          <select
            name="categoria"
            value={form.categoria}
            onChange={(e) =>
              setForm((s) => ({ ...s, categoria: (e.target.value || "").toUpperCase() }))
            }
          >
            <option value="">— Seleccioná una categoría —</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Zona / oasis</span>
          <select
            name="ubicacionOasis"
            value={ubicacionOasis}
            onChange={(e) => setUbicacionOasis(e.target.value)}
          >
            <option value="">Todas las zonas</option>
            {oasisDisponibles.map((value) => (
              <option key={value} value={value}>{OASIS_LABELS[value] || value}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Ubicación</span>
          <select
            name="ubicacionId"
            value={form.ubicacionId}
            onChange={onChange}
            required
          >
            <option value="">
              {ubicacionesFiltradas.length
                ? "— Seleccioná una ubicación —"
                : "— No hay ubicaciones para esa zona —"}
            </option>
            {ubicacionesFiltradas.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} {u.direccion ? `— ${u.direccion}` : ""} {u.oasis ? `• ${OASIS_LABELS[u.oasis] || u.oasis}` : ""}
              </option>
            ))}
          </select>
        </label>
        {loadingUbic && <small>Cargando ubicaciones…</small>}
        {!loadingUbic && (
          <small>
            {ubicacionesFiltradas.length} ubicaciones disponibles
            {ubicacionOasis ? ` en ${OASIS_LABELS[ubicacionOasis] || ubicacionOasis}` : ""}
          </small>
        )}

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="destacado"
            checked={form.destacado}
            onChange={onChange}
          />
          Destacado
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Guardando…" : "Crear evento"}
        </button>

        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
      </form>
    </div>
  );
}
