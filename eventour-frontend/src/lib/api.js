// src/lib/api.js

// === BASE de API (Railway) ===
export const API_BASE = import.meta.env.VITE_API_URL || "/api";

// === Helpers de auth ===
export const getToken = () => localStorage.getItem("token") || "";

export const authHeaders = (extra = {}) => {
  const t = getToken();
  return t
    ? {
        ...extra,
        Authorization: `Bearer ${t}`,
      }
    : { ...extra };
};

// === Fetch helpers ===
const asJson = async (res) => {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return res.json();
};

// GET JSON
export async function getJson(url, opts = {}) {
  const { auth = false, headers = {}, ...rest } = opts;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: auth ? authHeaders({ Accept: "application/json", ...headers }) : { Accept: "application/json", ...headers },
    ...rest,
  });
  if (!res.ok) {
    const body = await asJson(res);
    throw new Error(`GET ${url} -> ${res.status}: ${JSON.stringify(body)}`);
  }
  return asJson(res);
}

// POST JSON
export async function postJson(url, data, opts = {}) {
  const { auth = true, headers = {}, ...rest } = opts;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: auth
      ? authHeaders({ "Content-Type": "application/json", Accept: "application/json", ...headers })
      : { "Content-Type": "application/json", Accept: "application/json", ...headers },
    body: JSON.stringify(data ?? {}),
    ...rest,
  });
  if (!res.ok) {
    const body = await asJson(res);
    throw new Error(`POST ${url} -> ${res.status}: ${JSON.stringify(body)}`);
  }
  return asJson(res);
}

// PUT JSON
export async function putJson(url, data, opts = {}) {
  const { auth = true, headers = {}, ...rest } = opts;
  const res = await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: auth
      ? authHeaders({ "Content-Type": "application/json", Accept: "application/json", ...headers })
      : { "Content-Type": "application/json", Accept: "application/json", ...headers },
    body: JSON.stringify(data ?? {}),
    ...rest,
  });
  if (!res.ok) {
    const body = await asJson(res);
    throw new Error(`PUT ${url} -> ${res.status}: ${JSON.stringify(body)}`);
  }
  return asJson(res);
}

// DELETE
export async function del(url, opts = {}) {
  const { auth = true, headers = {}, ...rest } = opts;
  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: auth ? authHeaders({ Accept: "application/json", ...headers }) : { Accept: "application/json", ...headers },
    ...rest,
  });
  if (!res.ok) {
    const body = await asJson(res);
    throw new Error(`DELETE ${url} -> ${res.status}: ${JSON.stringify(body)}`);
  }
  // algunos DELETE no devuelven JSON
  try {
    return await asJson(res);
  } catch {
    return null;
  }
}

// UPLOAD (multipart/form-data) — para imágenes locales
export async function upload(url, formData, opts = {}) {
  const { auth = true, headers = {}, ...rest } = opts;
  const h = auth ? authHeaders(headers) : headers;
  // NO seteamos Content-Type para que el browser ponga el boundary correcto
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: h,
    body: formData,
    ...rest,
  });
  if (!res.ok) {
    const body = await asJson(res);
    throw new Error(`UPLOAD ${url} -> ${res.status}: ${JSON.stringify(body)}`);
  }
  return asJson(res);
}

/**
 * postJsonWithFallback:
 * – Intenta POST JSON normal.
 * – Si el backend devuelve 400 con "Required request body is missing",
 *   reintenta forzando cabeceras mínimas (algunos proxys o CORS molestan).
 */
export async function postJsonWithFallback(url, data, opts = {}) {
  try {
    return await postJson(url, data, opts);
  } catch (e) {
    const msg = String(e?.message || "");
    if (msg.includes("Required request body is missing")) {
      // reintento con headers simples
      return await postJson(url, data, { ...opts, headers: { Accept: "application/json" } });
    }
    throw e;
  }
}

// === Export default estilo "http" (compatibilidad con imports antiguos) ===
const http = {
  get: (url, opts) => getJson(url, opts),
  post: (url, data, opts) => postJson(url, data, opts),
  put: (url, data, opts) => putJson(url, data, opts),
  del: (url, opts) => del(url, opts),
  upload: (url, fd, opts) => upload(url, fd, opts),
};

export default http;

