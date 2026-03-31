import { useEffect, useMemo, useState } from "react";
import { API_BASE, del, getJson, postJson } from "../../lib/api";
import {
  BANNER_SLOT_LABELS,
  BANNER_SLOT_OPTIONS,
  DEFAULT_BANNER_LINK,
  normalizeBannerLink,
} from "../../lib/banners";

const MAX_BANNER_FILE_SIZE = 8 * 1024 * 1024;

const initialForm = {
  id: null,
  slot: BANNER_SLOT_OPTIONS[0]?.value || "HOME_TOP_1",
  imagenUrl: "",
  linkUrl: "",
  alt: "",
  activo: true,
};

export default function BannerAdmin() {
  const [form, setForm] = useState(initialForm);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await getJson(`${API_BASE}/banners`, { auth: true });
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET /banners error:", error);
      setBanners([]);
      setMessage(buildBannerErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const bannersOrdenados = useMemo(() => {
    const map = new Map(banners.map((banner) => [banner.slot, banner]));
    return BANNER_SLOT_OPTIONS.map((slot) => map.get(slot.value)).filter(Boolean);
  }, [banners]);

  const previewLink = normalizeBannerLink(form.linkUrl);
  const previewAlt = form.alt.trim() || BANNER_SLOT_LABELS[form.slot] || "Banner";

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedFileName("");
  };

  const handleEdit = (banner) => {
    setForm({
      id: banner.id ?? null,
      slot: banner.slot || initialForm.slot,
      imagenUrl: banner.imagenUrl || "",
      linkUrl: banner.linkUrl === DEFAULT_BANNER_LINK ? "" : banner.linkUrl || "",
      alt: banner.alt || "",
      activo: banner.activo !== false,
    });
    setSelectedFileName("");
    setMessage("");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("❌ El archivo elegido no es una imagen");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_BANNER_FILE_SIZE) {
      setMessage("❌ El banner supera el límite de 8 MB");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((current) => ({
        ...current,
        imagenUrl: dataUrl,
        alt: current.alt || file.name.replace(/\.[^.]+$/, ""),
      }));
      setSelectedFileName(file.name);
      setMessage("");
    } catch (error) {
      console.error("Banner file read error:", error);
      setMessage("❌ No se pudo leer el archivo");
    }

    event.target.value = "";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este banner?")) return;

    try {
      await del(`${API_BASE}/banners/${id}`, { auth: true });
      setMessage("✅ Banner eliminado");
      if (form.id === id) resetForm();
      await loadBanners();
    } catch (error) {
      console.error("DELETE /banners error:", error);
      setMessage(buildBannerErrorMessage(error));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await postJson(
        `${API_BASE}/banners`,
        {
          id: form.id,
          slot: form.slot,
          imagenUrl: form.imagenUrl.trim(),
          linkUrl: form.linkUrl.trim(),
          alt: form.alt.trim(),
          activo: !!form.activo,
        },
        { auth: true }
      );

      setMessage("✅ Banner guardado");
      resetForm();
      await loadBanners();
    } catch (error) {
      console.error("POST /banners error:", error);
      setMessage(buildBannerErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-form-shell">
      {message && (
        <div className="admin-form-head">
          <p className={`admin-form-status ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </p>
        </div>
      )}

      <form className="admin-form admin-banner-form" onSubmit={handleSubmit}>
        <section className="admin-form-block">
          <div className="admin-form-block-head">
            <div>
              <h4>Banner</h4>
              <p>Elegí el espacio y cargá la pieza.</p>
            </div>
          </div>

          <div className="admin-form-grid admin-form-grid-2">
            <label className="admin-field">
              <span>Ubicación del banner</span>
              <select name="slot" value={form.slot} onChange={onChange} required>
                {BANNER_SLOT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-field">
              <span>Texto alternativo</span>
              <input
                name="alt"
                placeholder="Nombre del auspiciante o campaña"
                value={form.alt}
                onChange={onChange}
              />
            </label>
          </div>

          <label className="admin-field">
            <span>Imagen del banner</span>
            <input
              type="text"
              name="imagenUrl"
              placeholder="https://... o seleccioná un archivo"
              value={form.imagenUrl}
              onChange={onChange}
              required
            />
          </label>
          <div className="admin-field-hint">
            <span>URL o archivo local.</span>
          </div>

          <label className="admin-field">
            <span>Archivo local</span>
            <input
              type="file"
              accept="image/*,.gif,.webp,.avif"
              onChange={handleFileChange}
            />
          </label>
          <div className="admin-field-hint">
            <span>JPG, PNG, WEBP o GIF. Máx. 8 MB.</span>
            <span>{selectedFileName ? `Archivo: ${selectedFileName}` : "Si una URL falla, usa archivo local."}</span>
          </div>

          <label className="admin-field">
            <span>Link del auspiciante</span>
            <input
              type="url"
              name="linkUrl"
              placeholder="https://... (vacío = Eventour)"
              value={form.linkUrl}
              onChange={onChange}
            />
          </label>

          <label className="admin-check-card admin-check-card-centered admin-banner-toggle">
            <input type="checkbox" name="activo" checked={form.activo} onChange={onChange} />
            <span>
              <strong>Banner activo</strong>
              <small>Si lo apagás, vuelve el fallback.</small>
            </span>
          </label>
        </section>

        <section className="admin-form-block admin-form-block-accent">
          <div className="admin-form-block-head">
            <div>
              <h4>Vista previa</h4>
              <p>Revisá el banner antes de guardar.</p>
            </div>
          </div>

          <div className="admin-banner-preview-card">
            <div className="admin-banner-preview-media">
              {form.imagenUrl.trim() ? (
                <img
                  src={form.imagenUrl.trim()}
                  alt={previewAlt}
                  className="admin-banner-preview-image"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/assets/bannernegro-cXfYfe60.jpg";
                  }}
                />
              ) : (
                <div className="admin-banner-preview-empty">Pegá una URL para previsualizar el banner</div>
              )}
            </div>

            <div className="admin-banner-preview-copy">
              <strong>{BANNER_SLOT_LABELS[form.slot] || form.slot}</strong>
              <span>{previewAlt}</span>
              <small>Destino: {previewLink}</small>
            </div>
          </div>

          <div className="admin-banner-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Guardando…" : form.id ? "Actualizar banner" : "Guardar banner"}
            </button>
            {form.id ? (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancelar edición
              </button>
            ) : null}
          </div>
        </section>
      </form>

      <div className="admin-banner-list-shell">
        <div className="admin-section-head">
          <div>
            <h3>Banners cargados</h3>
            <p className="admin-section-copy">Tenés {banners.length} slot{banners.length === 1 ? "" : "s"} configurado{banners.length === 1 ? "" : "s"}.</p>
          </div>
          <button className="btn-secondary" type="button" onClick={loadBanners} disabled={loading}>
            {loading ? "Actualizando…" : "Refrescar"}
          </button>
        </div>

        {bannersOrdenados.length === 0 ? (
          <p className="no-eventos">Todavía no hay banners guardados. Mientras tanto se usan los banners actuales.</p>
        ) : (
          <div className="admin-banner-list">
            {bannersOrdenados.map((banner) => (
              <article key={banner.id} className="admin-banner-item">
                <div className="admin-banner-thumb">
                  <img
                    src={banner.imagenUrl}
                    alt={banner.alt || "Banner"}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/assets/bannernegro-cXfYfe60.jpg";
                    }}
                  />
                </div>

                <div className="admin-banner-item-copy">
                  <strong>{BANNER_SLOT_LABELS[banner.slot] || banner.slot}</strong>
                  <span>{banner.alt || "Sin texto alternativo"}</span>
                  <small>{normalizeBannerLink(banner.linkUrl)}</small>
                </div>

                <div className="admin-banner-item-side">
                  <span className={`chip ${banner.activo ? "" : "ghost"}`}>
                    {banner.activo ? "Activo" : "Inactivo"}
                  </span>
                  <div className="admin-banner-item-actions">
                    <button type="button" className="btn-secondary" onClick={() => handleEdit(banner)}>
                      Editar
                    </button>
                    <button type="button" className="btn-danger" onClick={() => handleDelete(banner.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
}

function buildBannerErrorMessage(error) {
  const raw = String(error?.message || "");

  if (raw.includes("/api/banners") && raw.includes("404")) {
    return "❌ El backend publicado todavía no tiene habilitado el módulo de banners. Falta desplegar el backend nuevo en Railway.";
  }

  return "❌ No se pudo guardar el banner";
}
