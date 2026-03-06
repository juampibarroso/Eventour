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

  useEffect(() => {
    const emailGuardado = localStorage.getItem("adminEmailRecordado");
    if (emailGuardado) {
      setEmail(emailGuardado);
      setRecordarUsuario(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const API = import.meta.env.VITE_API_URL;

      const { data } = await axios.post(
        `${API}/auth/login`,
        {
          username: email,        // ⬅️ el backend espera username
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      const { token, role } = data || {};

      if (!token) {
        setError("Respuesta inválida del servidor.");
        return;
      }

      if (role !== "ADMIN") {
        setError("No tenés permisos de administrador.");
        return;
      }

      // guardar credenciales
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (recordarUsuario) {
        localStorage.setItem("adminEmailRecordado", email);
      } else {
        localStorage.removeItem("adminEmailRecordado");
      }

      onLogin?.(true);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error al intentar loguear:", err?.response?.status, err?.response?.data);
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
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
