import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useState } from "react";
import "../styles.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/user"); // redirect after successful login
    }
  };

  return (
    <div className="centered-container">
      <form onSubmit={handleLogin} className="profile-container">
        <h2>🔐 Log In</h2>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="action-button">
          Log In
        </button>
        <p style={{ marginTop: "1rem" }}>
          Forgot password? <a href="/reset-password">Reset it here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
