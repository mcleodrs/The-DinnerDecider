import { useState } from "react";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";

export default function PWReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-confirm`,
    });
    if (error) setError(error.message);
    else {
      setMessage("Password reset email sent.");
      setError(null);
    }
  };

  return (
    <div className="auth-container">
      <h1>Reset Password</h1>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter your account email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <div className="auth-footer-links">
        <Link to="/login">Back to Login</Link>
        <Link to="/register">New here?</Link>
      </div>
      <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
