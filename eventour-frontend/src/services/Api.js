const BASE_URL = import.meta.env.VITE_API_URL;

export async function getEvents() {
  try {
    const response = await fetch(`${BASE_URL}/eventos`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const text = await response.text(); // leer como texto primero
    const data = text ? JSON.parse(text) : [];

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
}

export async function createEvent(eventData) {
  const response = await fetch(`${BASE_URL}/eventos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  return response.json();
}
