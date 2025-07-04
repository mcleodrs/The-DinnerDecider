import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("No authenticated user");
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("full_name, email, role, uitheme_pref, is_owner, is_admin")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
      } else {
        setUserData(data);
      }

      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  if (loading) return <div className="auth-container">Loading profile...</div>;
  if (!userData) return <div className="auth-container">User data not found.</div>;

  return (
    <div className="profile-container">
      <h2>Welcome, {userData.full_name || "Chef"}!</h2>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Role:</strong> {userData.role}</p>
      <p><strong>Theme Preference:</strong> {userData.uitheme_pref}</p>
      <p><strong>Account Owner:</strong> {userData.is_owner ? "Yes" : "No"}</p>
      <p><strong>Admin:</strong> {userData.is_admin ? "Yes" : "No"}</p>

      <div style={{ marginTop: "1.5rem" }}>
        <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
        <button style={{ marginLeft: "1rem" }} onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>

      <div style={{ marginTop: "1rem", textAlign: "left" }}>
        <a href="/logout" style={{ fontSize: "0.9rem" }}>← Logout</a>
      </div>
    </div>
  );
}
