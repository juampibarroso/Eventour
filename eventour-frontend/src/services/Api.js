const API_URL = "http://localhost:8080/api/eventos"; // Ajusta la URL según el backend

export async function getEvents() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const text = await response.text(); // leer como texto primero
    const data = text ? JSON.parse(text) : []; // evitar error si está vacío

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
}

export async function createEvent(eventData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  return response.json();
}
