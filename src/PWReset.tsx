import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function PWReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-confirm`,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Check your email for reset instructions.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Reset Password</h1>
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReset}>Send Reset Email</button>
      {message && <p>{message}</p>}
      <div style={{ textAlign: "left", marginTop: "1rem" }}>
        <a href="/login" style={{ fontSize: "0.9rem" }}>← Back</a>
      </div>
    </div>
  );
}
