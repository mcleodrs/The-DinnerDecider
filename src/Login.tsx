import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; // adjust path if needed

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let authResponse;

      if (isRegister) {
        // Create a new user
        authResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: "Diner", // Default for now
              ui_theme_pref: "red",
            },
          },
        });
      } else {
        // Login existing user
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (authResponse.error) {
        throw authResponse.error;
      }

      // ✅ Redirect based on user metadata
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const role = user?.user_metadata?.role;

      if (role === "Chef") {
        navigate("/dashboard");
      } else {
        navigate("/user");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <br />
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <br />
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "New here? Register"}
      </button>
    </div>
  );
}
