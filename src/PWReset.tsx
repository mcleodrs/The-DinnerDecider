import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "./styles.css";

export default function PWReset() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tokenReady, setTokenReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(({ error }) => {
          if (error) {
            setError("Session could not be established.");
          } else {
            setTokenReady(true);
          }
        });
    } else {
      setError("Missing token. Please use the link in your email.");
    }
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("✅ Password updated! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="profile-container" style={{ position: "relative", maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Reset Your Password</h2>

      {tokenReady ? (
        <form onSubmit={handlePasswordReset}>
          <label htmlFor="newPassword" style={{ display: "block", marginTop: "1rem" }}>New Password</label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />

          <label htmlFor="confirmPassword" style={{ display: "block" }}>Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "1.5rem",
              padding: "0.75rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Update Password
          </button>
        </form>
      ) : (
        <p style={{ marginTop: "1rem" }}>Preparing reset form...</p>
      )}

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}

      <Link to="/login" style={{
        position: "absolute",
        bottom: "1rem",
        left: "1rem",
        color: "#007bff",
        fontSize: "0.9rem",
        textDecoration: "none"
      }}>
        ← Back to Login
      </Link>
    </div>
  );
}
