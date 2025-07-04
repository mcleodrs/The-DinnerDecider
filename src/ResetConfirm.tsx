import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ResetConfirm() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated! You can now log in.");
      setTimeout(() => navigate("/login"), 2500);
    }
  };

  return (
    <div className="centered-container">
      <div className="form-card">
        <h2>Set New Password</h2>
        <form onSubmit={handlePasswordUpdate}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Update Password</button>
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
