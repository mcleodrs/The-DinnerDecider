import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Footer from "./pages/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate("/user");
    }
  };

  return (
    <div className="centered-container">
      <div className="profile-container">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        {error && <p className="error-message">{error}</p>}

        <div className="auth-actions">
          <button className="secondary-btn" onClick={() => navigate("/register")}>
            New here? Register
          </button>

          <button className="secondary-btn" onClick={() => navigate("/pw-reset")}>
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
}
