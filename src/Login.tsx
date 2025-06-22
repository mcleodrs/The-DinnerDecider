import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

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
        authResponse = await supabase.auth.signUp({
          email,
          password,
        });

        if (authResponse.error) throw authResponse.error;

        const user = authResponse.data.user;
        if (!user) throw new Error("Could not retrieve authenticated user.");

        await supabase.from("users").insert([
          {
            id: user.id,
            full_name: fullName,
            email,
            role: "Chef", // default role
            uitheme_pref: "red",
            is_owner: true,
          },
        ]);
      } else {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authResponse.error) throw authResponse.error;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user?.id)
        .single();

      if (profile?.role === "Chef") {
        navigate("/dashboard");
      } else {
        navigate("/user");
      }
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="profile-container">
      <h2>{isRegister ? "Register" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <br />
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already registered? Login" : "New here? Register"}
      </button>
    </div>
  );
}
