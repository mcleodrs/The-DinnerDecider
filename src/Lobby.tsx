import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

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

    return (
        <div className="profile-container">
            <h2>Welcome to your Lobby 🍽️</h2>
            <p>{userEmail}</p>
            <button onClick={() => navigate("/create-event")}>Create Event</button>
            <button onClick={() => navigate("/dashboard")}>Pantry</button>
            <button onClick={() => navigate("/user")}>Profile</button>
            <button onClick={() => navigate("/settings")}>Settings</button>
        </div>
    );
}
