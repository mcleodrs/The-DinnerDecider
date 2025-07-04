import { useState } from "react";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";

export default function PWReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-confirm`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div className="centered-container">
      <div className="form-card">
        <h2>Password Reset</h2>
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Email</button>
        </form>

        <div className="auth-actions">
          <Link to="/login">
            <button className="secondary-btn">Back to Login</button>
          </Link>
        </div>

        <div className="back-link">
          <Link to="/">← Back to Home</Link>
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}
