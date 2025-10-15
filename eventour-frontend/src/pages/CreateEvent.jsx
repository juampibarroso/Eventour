// src/pages/CreateEvent.jsx
import { useEffect, useMemo, useState } from "react";
import { API_BASE, getJson, postJson } from "../lib/api";

const CATEGORIAS = [
  "SHOW",
  "GASTRONOMIAYVINO",
  "MUSICA",
  "TEATRO",
  "DEPORTE",
  "FESTIVAL",
  "FERIA",
  "OTROS",
];

const ESTADOS = ["ACTIVO", "CANCELADO", "FINALIZADO", "PAUSADO"];

const initial = {
  titulo: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  precio: "",
  imagen: "",            // <— tu backend espera "imagen" (string URL)
  categoriaEvento: "",   // <— enum EXACTO en mayúsculas
  ubicacionId: "",       // <— seleccionable desde /ubicaciones
  estado: "ACTIVO",
  destacado: false,
};

export default function CreateEvent() {
  const [form, setForm] = useState(initial);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState("");

  // Cargar ubicaciones (público)
  useEffect(() => {
    (async () => {
      try {
        const data = await getJson(`${API_BASE}/ubicaciones`, { auth: false });
        setUbicaciones(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("GET ubicaciones error:", e);
        setUbicaciones([]);
      }
    })();
  }, []);

  // preview de imagen por URL
  useEffect(() => {
    setPreview(form.imagen?.trim() || "");
  }, [form.imagen]);

  const canSave = useMemo(() => {
    return (
      form.titulo.trim() &&
      form.fechaInicio &&
      form.categoriaEvento &&
      form.ubicacionId
    );
  }, [form]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!canSave || saving) return;
    setSaving(true);

    try {
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion?.trim() || "",
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin || null,
        precio: form.precio ? Number(form.precio) : 0,
        imagen: form.imagen?.trim() || "",
        estado: form.estado || "ACTIVO",
        ubicacionId: Number(form.ubicacionId),
        categoriaEvento: form.categoriaEvento, // enum exacto
        destacado: !!form.destacado,
      };

      await postJson(`${API_BASE}/eventos`, payload, { auth: true });
      setMsg("✅ Evento creado con éxito");
      setForm(initial);
      setPreview("");
    } catch (e) {
      console.error("❌ Error creando evento:", e);
      setMsg("❌ No se pudo crear el evento");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <h2 style={{ marginTop: 0 }}>Crear Evento</h2>

      <input
        name="titulo"
        placeholder="Título"
        value={form.titulo}
        onChange={onChange}
        required
      />

      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={onChange}
        rows={4}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label>
          <span style={{ display: "block", marginBottom: 4 }}>Fecha inicio</span>
          <input
            type="date"
            name="fechaInicio"
            value={form.fechaInicio}
            onChange={onChange}
            required
          />
        </label>
        <label>
          <span style={{ display: "block", marginBottom: 4 }}>Fecha fin</span>
          <input
            type="date"
            name="fechaFin"
            value={form.fechaFin}
            onChange={onChange}
          />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input
          type="number"
          name="precio"
          placeholder="Precio (opcional)"
          value={form.precio}
          onChange={onChange}
          min="0"
        />

        <select
          name="estado"
          value={form.estado}
          onChange={onChange}
        >
          {ESTADOS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Imagen por URL (el backend guarda string) */}
      <label style={{ display: "block", marginTop: 6, marginBottom: 6 }}>
        URL de imagen (https://…)
      </label>
      <input
        name="imagen"
        placeholder="Pegá la URL de la imagen"
        value={form.imagen}
        onChange={onChange}
      />
      {preview && (
        <div style={{ marginTop: 8 }}>
          <img
            src={preview}
            alt="preview"
            style={{
              maxWidth: "100%",
              height: 160,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #333",
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/assets/bannernegro-cXfYfe60.jpg";
            }}
          />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        {/* Categoría enum exacto */}
        <select
          name="categoriaEvento"
          value={form.categoriaEvento}
          onChange={onChange}
          required
        >
          <option value="">— Categoría —</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Ubicación desde API */}
        <select
          name="ubicacionId"
          value={form.ubicacionId}
          onChange={onChange}
          required
        >
          <option value="">— Ubicación —</option>
          {ubicaciones.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre} — {u.direccion}
            </option>
          ))}
        </select>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
        <input
          type="checkbox"
          name="destacado"
          checked={form.destacado}
          onChange={onChange}
        />
        Destacado
      </label>

      <button type="submit" disabled={!canSave || saving}>
        {saving ? "Guardando…" : "Crear"}
      </button>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </form>
  );
}
