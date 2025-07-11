import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin.css";

const LoginAdmin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordarUsuario, setRecordarUsuario] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 👉 Al cargar el componente, verificar si hay un email guardado
  useEffect(() => {
    const emailGuardado = localStorage.getItem("adminEmailRecordado");
    if (emailGuardado) {
      setEmail(emailGuardado);
      setRecordarUsuario(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("🧪 Entró al handleLogin con:", email, password);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username: email,
        password: password,
      });

      const { token, role } = response.data;

      if (role === "ADMIN") {
        try {
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);

          // ✅ Guardar email si está tildado "Recordar usuario"
          if (recordarUsuario) {
            localStorage.setItem("adminEmailRecordado", email);
          } else {
            localStorage.removeItem("adminEmailRecordado");
          }

        } catch (err) {
          console.warn("⚠️ No se pudo acceder a localStorage:", err);
        }

        onLogin(true);
        navigate("/admin/dashboard");
      } else {
        setError("No tenés permisos de administrador.");
      }
    } catch (err) {
      console.log("🧪 Error al intentar loguear:", err);
      setError("Credenciales incorrectas o servidor no disponible.");
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Iniciar Sesión (Admin)</h2>
        {error && <p className="login-error">{error}</p>}
        
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="recordar-checkbox">
          <input
            type="checkbox"
            checked={recordarUsuario}
            onChange={(e) => setRecordarUsuario(e.target.checked)}
          />
          Recordar usuario
        </label>

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default LoginAdmin;
