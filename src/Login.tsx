import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./styles.css";

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            if (isRegister) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage("Check your email to confirm registration.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate("/");
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError("Enter your email first.");
            return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) setError(error.message);
        else setMessage("Password reset email sent. Check your inbox.");
    };

    return (
        <div className="profile-container">
            <h2>{isRegister ? "Register" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                )}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">{isRegister ? "Register" : "Login"}</button>
            </form>
            <button onClick={() => setIsRegister(!isRegister)} style={{ marginTop: "1rem" }}>
                {isRegister ? "Already have an account? Login" : "New here? Register"}
            </button>
            <br  />
            <button onClick={handleResetPassword} style={{ marginTop: "1rem" }}>Forgot Password?</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
        </div>
    );
}
