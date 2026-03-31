const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function getEvents() {
  try {
    const res = await fetch(`${BASE_URL}/eventos`);
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const text = await res.text();
    const data = text ? JSON.parse(text) : [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
}

export async function createEvent(eventData) {
  const token = localStorage.getItem("token");

  // si llega string, lo pasamos a número
  const payload = {
    ...eventData,
    ubicacionId: eventData.ubicacionId ? Number(eventData.ubicacionId) : eventData.ubicacionId,
  };

  const res = await fetch(`${BASE_URL}/eventos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error creando evento (${res.status}): ${msg}`);
  }

  return res.json();
}
