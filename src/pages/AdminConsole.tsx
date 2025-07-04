import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function AdminConsole() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const checkAdmin = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error || !user) {
                navigate("/login");
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from("users")
                .select("is_admin, email")
                .eq("id", user.id)
                .single();

            if (profileError || !profile?.is_admin) {
                navigate("/login");
                return;
            }

            setUserEmail(profile.email);
            setIsAdmin(true);
            setLoading(false);
        };

        checkAdmin();
    }, [navigate]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="admin-console">
            <h2>Admin Console</h2>
            <p>Welcome, {userEmail}</p>

            <div className="admin-tools">
                <ul>
                    <li>View app stats (coming soon)</li>
                    <li>Manage users (coming soon)</li>
                    <li>Resolve issues or tickets (coming soon)</li>
                </ul>
            </div>
        </div>
    );
}
