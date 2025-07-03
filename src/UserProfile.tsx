import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

export default function UserProfile() {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [clicks, setClicks] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error || !user) {
                navigate("/login");
                return;
            }

            const { data, error: profileError } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();

            if (!profileError && data) {
                setUserInfo(data);
            }
        }

        fetchUser();
    }, [navigate]);

    const handleSecretClick = () => {
        const newCount = clicks + 1;
        if (newCount >= 3) {
            navigate("/admin");
        } else {
            setClicks(newCount);
            setTimeout(() => setClicks(0), 3000); // reset after 3s
        }
    };

    if (!userInfo) return <p>Loading profile...</p>;

    return (
        <div className="profile-container">
            <h2>Welcome, {userInfo.full_name || "User"}!</h2>
            <p>Email: {userInfo.email}</p>
            <p>Role: {userInfo.role}</p>
            <p>Theme Preference: {userInfo.uitheme_pref}</p>

            {/* Secret Admin Access */}
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    cursor: "pointer",
                }}
            >
                <Star onClick={handleSecretClick} style={{ cursor: "pointer" }}>
                    <title>⭐ Secret Admin Star</title>
                </Star>

            </div>
        </div>
    );
}
