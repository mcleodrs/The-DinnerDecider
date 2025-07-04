import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./styles.css";

export default function NavBar() {
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getSessionUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUser(user);

                const { data: profile } = await supabase
                    .from("users")
                    .select("role, is_admin")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setRole(profile.role);
                    setIsAdmin(profile.is_admin || false);
                }
            }
        };

        getSessionUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate("/");
    };

    return (
        <nav className="navbar">
            <Link to="/lobby" className="nav-item">
                🏠 Home
            </Link>

            {user ? (
                <>
                    <Link to="/users" className="nav-item">
                        👤 Profile
                    </Link>

                    {role === "Chef" && (
                        <Link to="/dashboard" className="nav-item">
                            🍳 Chef Dashboard
                        </Link>
                    )}

                    <button onClick={handleLogout} className="nav-item nav-button">
                        🚪 Logout
                    </button>
                </>
            ) : (
                <Link to="/login" className="nav-item">
                    🔐 Login / Register
                </Link>
            )}
        </nav>
    );
}
