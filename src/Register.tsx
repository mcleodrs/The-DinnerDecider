import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else {
      setMessage("Check your email to confirm your registration.");
      setError(null);
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <div className="auth-footer-links">
        <Link to="/login">Already have an account?</Link>
        <Link to="/pwreset">Forgot Password?</Link>
      </div>
      <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
