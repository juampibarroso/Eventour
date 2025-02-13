import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";

function App() {
  return (
    <div>

      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/create-event">Crear Evento</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />
      </Routes>

      
    </div>

    
  );
}

export default App;
