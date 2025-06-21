import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // for registration
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isRegister) {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Wait for the auth session to be available
      const user = signUpData.user;

      if (!user) {
        setError("Could not retrieve authenticated user.");
        return;
      }

      // Now insert user profile securely
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id, // 👈 links to auth.users
          full_name: name,
          email: user.email,
          role: "Diner",
          uitheme_pref: "red",
        },
      ]);

      if (insertError) {
        setError("Profile creation failed: " + insertError.message);
        return;
      }

      navigate("/dashboard");
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) return setError(signInError.message);
      navigate("/dashboard");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "2rem" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>

      {isRegister && (
        <>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />
        </>
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ marginTop: "1rem" }}>
        {isRegister ? "Already have an account?" : "Need an account?"}{" "}
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </form>
  );
}
