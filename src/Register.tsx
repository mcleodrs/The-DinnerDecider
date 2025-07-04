import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Create user profile
    if (data.user) {
      await supabase.from("users").insert([
        {
          id: data.user.id,
          email,
          full_name: fullName,
          role: "Chef",
        },
      ]);
    }

    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Create Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Sign Up</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ textAlign: "left", marginTop: "1rem" }}>
        <a href="/login" style={{ fontSize: "0.9rem" }}>← Back</a>
      </div>
    </div>
  );
}
