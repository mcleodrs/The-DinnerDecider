import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetConfirm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setConfirmed(true);
      }
    });
  }, []);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <h1>Set New Password</h1>
      {confirmed ? (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleReset}>Update Password</button>
        </>
      ) : (
        <p>Waiting for password recovery confirmation...</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ textAlign: "left", marginTop: "1rem" }}>
        <a href="/login" style={{ fontSize: "0.9rem" }}>← Back</a>
      </div>
    </div>
  );
}
