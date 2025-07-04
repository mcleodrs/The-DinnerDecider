import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate("/profile");
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="auth-footer-links">
        <Link to="/register">New here? Register</Link>
        <Link to="/pwreset">Forgot Password?</Link>
      </div>
      <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
