const API_URL = "http://localhost:8080/api/eventos"; // Ajusta la URL según el backend

export async function getEvents() {
  const response = await fetch(API_URL);
  return response.json();
}

export async function createEvent(eventData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  return response.json();
}
