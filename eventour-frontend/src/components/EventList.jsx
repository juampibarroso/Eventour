import { useEffect, useState } from "react";
import { getEvents } from "../services/Api.js";
import EventCard from "./EventCard";

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents();
      setEvents(data);
    }
    fetchEvents();
  }, []);

  return (
    <div>
      {events.length === 0 ? <p>No hay eventos disponibles</p> : 
        events.map(event => <EventCard key={event.id} event={event} />)}
    </div>
  );
}

export default EventList;
