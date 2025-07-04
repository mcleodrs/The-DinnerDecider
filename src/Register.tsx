import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./styles.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email to confirm registration.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setError("");
            setMessage("");
          }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setMessage("");
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
            setMessage("");
          }}
          required
        />
        <button type="submit">Register</button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <Link to="/login">Already have an account? Login</Link>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <Link to="/" style={{ position: "absolute", bottom: 10, left: 10, fontSize: "0.9rem" }}>
        ← Back
      </Link>
    </div>
  );
}
