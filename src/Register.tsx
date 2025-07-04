import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./pages/Footer";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [uiTheme, setUiTheme] = useState("red");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.user) {
      setError("User not created.");
      return;
    }

    const { error: dbError } = await supabase.from("users").insert([
      {
        id: data.user.id,
        email,
        full_name: fullName,
        role: "Chef", // All new users start as Chef
        uitheme_pref: uiTheme,
        is_owner: true,
        is_admin: false,
      },
    ]);

    if (dbError) {
      setError(dbError.message);
    } else {
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/user"), 2000);
    }
  };

  return (
    <div className="centered-container">
      <div className="profile-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={uiTheme}
            onChange={(e) => setUiTheme(e.target.value)}
            required
          >
            <option value="red">Red Theme</option>
            <option value="blue">Blue Theme</option>
            <option value="green">Green Theme</option>
          </select>
          <button type="submit">Register</button>
        </form>

        <div className="auth-actions">
          <Link to="/login">
            <button className="secondary-btn">Already have an account? Login</button>
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
