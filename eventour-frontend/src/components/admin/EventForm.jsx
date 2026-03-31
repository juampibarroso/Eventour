// src/components/admin/EventForm.jsx
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { API_BASE, getJson, postJson } from "../../lib/api";
import { CATEGORY_LABELS, CATEGORY_VALUES } from "../../lib/categories";
import { normalizeTicketUrl } from "../../lib/eventDisplay";
import { OASIS_LABELS, getAvailableOases, filterLocationsByOasis } from "../../lib/locations";

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

  const buildPayload = () => ({
    titulo: form.titulo.trim(),
    descripcion: form.descripcion?.trim() || "",
    fechaInicio: form.fechaInicio || null,
    fechaFin: form.fechaFin || form.fechaInicio || null,
    precio: 0,
    linkEntradas: normalizeTicketUrl(form.linkEntradas) || "",
    imagen: form.imagenUrl?.trim() || "",
    estado: "ACTIVO",
    ubicacionId: Number(form.ubicacionId),
    categoriaEvento: form.categoria ? String(form.categoria).toUpperCase() : null,
    destacado: !!form.destacado,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      const payload = buildPayload();
      console.log("POST /eventos payload:", payload);
      await postJson(`${API_BASE}/eventos`, payload, { auth: true });

      setMsg("✅ Evento creado con éxito");
      setForm(initial);
      if (typeof onSaved === "function") onSaved();
    } catch (err) {
      console.error("POST /eventos error:", err);
      const rawMessage = String(err?.message || "");
      setMsg(buildEventErrorMessage(rawMessage));
    } finally {
      setSaving(false);
    }
  };

  const preview = form.imagenUrl?.trim() || "/assets/bannernegro-cXfYfe60.jpg";
  const statusTone = msg.startsWith("✅") ? "success" : "error";
  const previewDate = form.fechaInicio || form.fechaFin || "Sin fecha";
  const previewCategory = form.categoria ? (CATEGORY_LABELS[form.categoria] || form.categoria) : "Sin categoría";

  return (
    <div className="admin-form-shell">
      {msg && (
        <div className="admin-form-head">
          <p className={`admin-form-status ${statusTone}`}>{msg}</p>
        </div>
      )}

      <form className="admin-form admin-event-form" onSubmit={onSubmit}>
        <section className="admin-form-block">
          <div className="admin-form-block-head">
            <div>
              <h4>Contenido</h4>
            </div>
          </div>

          <label className="admin-field">
            <span>Título del evento</span>
            <input
              name="titulo"
              placeholder="Título del evento"
              value={form.titulo}
              onChange={onChange}
              required
            />
          </label>

          <label className="admin-field">
            <span>Descripción</span>
            <textarea
              name="descripcion"
              placeholder="Descripción completa del evento"
              value={form.descripcion}
              onChange={onChange}
              maxLength={DESCRIPTION_LIMIT}
              rows={8}
              style={{ minHeight: 160, resize: "vertical" }}
            />
          </label>
          <div className="admin-field-hint admin-field-hint-single">
            <span>{descriptionLength} / {DESCRIPTION_LIMIT} caracteres</span>
          </div>
        </section>

        <div className="admin-event-columns">
          <section className="admin-form-block">
            <div className="admin-form-block-head">
              <div>
                <h4>Programación</h4>
                <p>Fecha, entradas y clasificación general del evento.</p>
              </div>
            </div>

            <div className="admin-form-grid admin-form-grid-2">
              <label className="admin-field">
                <span>Fecha inicio</span>
                <input
                  type="date"
                  name="fechaInicio"
                  value={form.fechaInicio}
                  onChange={onChange}
                  required
                />
              </label>

              <label className="admin-field">
                <span>Fecha fin</span>
                <input
                  type="date"
                  name="fechaFin"
                  value={form.fechaFin}
                  onChange={onChange}
                />
              </label>

              <label className="admin-field admin-field-span">
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

              <label className="admin-field">
                <span>Categoría</span>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, categoria: (e.target.value || "").toUpperCase() }))
                  }
                >
                  <option value="">— Seleccioná una categoría —</option>
                  {CATEGORY_VALUES.map((c) => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
                  ))}
                </select>
              </label>

              <label className="admin-field">
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

              <label className="admin-field admin-field-span">
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
            </div>

            {loadingUbic && <small className="admin-support-copy">Cargando ubicaciones…</small>}
            {!loadingUbic && (
              <small className="admin-support-copy">
                {ubicacionesFiltradas.length} ubicaciones disponibles
                {ubicacionOasis ? ` en ${OASIS_LABELS[ubicacionOasis] || ubicacionOasis}` : ""}
              </small>
            )}

            <label className="admin-check-card admin-check-card-centered">
              <input
                type="checkbox"
                name="destacado"
                checked={form.destacado}
                onChange={onChange}
              />
              <span>
                <strong>Marcar como destacado</strong>
                <small>Este evento puede aparecer primero en home y secciones destacadas.</small>
              </span>
            </label>
          </section>

          <section className="admin-form-block admin-form-block-accent">
            <div className="admin-form-block-head">
              <div>
                <h4>Imagen y vista previa</h4>
              </div>
            </div>

            <label className="admin-field img-field">
              <span className="img-label">Imagen (URL completa)</span>
              <input
                name="imagenUrl"
                placeholder="https://…"
                value={form.imagenUrl}
                onChange={onChange}
              />
            </label>
            <small className="img-or">
              Formato recomendado: JPG/PNG/WEBP.
            </small>

            <div className="admin-preview-card">
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

              <div className="admin-preview-copy">
                <strong>{form.titulo || "Vista previa del evento"}</strong>
                <span>{previewCategory}</span>
                <small>{previewDate}</small>
              </div>
            </div>
          </section>
        </div>

        <div className="admin-form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Crear evento"}
          </button>
        </div>
      </form>
    </div>
  );
}

EventForm.propTypes = {
  onSaved: PropTypes.func,
};

function buildEventErrorMessage(rawMessage) {
  if (!rawMessage) {
    return "❌ No se pudo crear el evento";
  }

  if (rawMessage.includes("Unsupported Media Type")) {
    return "❌ El backend rechazó el formato del envío. Recarga la página e inténtalo otra vez.";
  }

  if (rawMessage.includes("Required request body is missing")) {
    return "❌ El backend publicado no está leyendo bien el cuerpo del evento. Si persiste, hay que redeployar el backend con el ajuste del formulario.";
  }

  if (rawMessage.includes("La fecha de inicio debe ser futura")) {
    return "❌ La fecha de inicio debe ser hoy o futura.";
  }

  if (rawMessage.includes("La fecha de fin no puede ser anterior")) {
    return "❌ La fecha de fin no puede ser anterior a la fecha de inicio.";
  }

  if (rawMessage.includes("Ubicación no encontrada")) {
    return "❌ La ubicación elegida ya no existe. Vuelve a seleccionarla.";
  }

  if (rawMessage.includes("El link de entradas debe ser una URL válida")) {
    return "❌ El link de entradas no es válido.";
  }

  return "❌ No se pudo crear el evento";
}
