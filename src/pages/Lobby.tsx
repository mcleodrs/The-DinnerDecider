import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import "../styles.css";

export default function Lobby() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState<string | undefined>();

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return navigate("/login");
            setUserEmail(user.email);
        }
        checkUser();
    }, []);

    const navOptions = [
        { label: "Create Event", route: "/create-event" },
        { label: "Pantry", route: "/dashboard" },
        { label: "Profile", route: "/user" },
        { label: "Settings", route: "/settings" },
    ];

    return (
        <div  className="centered-container">
        <div className="profile-container">
            <h2>Welcome to your Lobby 🍽️</h2>
            <p style={{ marginBottom: "1.5rem" }}>{userEmail}</p>

            <div className="horizontal-nav-wrap">
                {navOptions.map((opt) => (
                    <button
                        key={opt.label}
                        className="nav-option-button"
                        onClick={() => navigate(opt.route)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
        </div>
    );
}
