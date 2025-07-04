import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../auth/auth"; // Centralized user state
import Footer from "../components/Footer";

export default function UserProfile() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      let currentUser = user;

      if (!currentUser && !loading) {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          navigate("/login");
          return;
        }
        currentUser = data.user;
      }

      if (!currentUser) return;

      const { data, error } = await supabase
        .from("users")
        .select("full_name, email, role, uitheme_pref, is_owner, is_admin")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
      } else {
        setUserData(data);
      }

      setProfileLoading(false);
    };

    loadProfile();
  }, [user, loading, navigate]);

  if (loading || profileLoading || !userData) {
    return <div className="auth-container">Loading profile...</div>;
  }

  return (
    <>
      <div className="centered-container">
        <div className="profile-container">
          <h2>Welcome, {userData.full_name || "Chef"}!</h2>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <p><strong>Theme Preference:</strong> {userData.uitheme_pref}</p>
          <p><strong>Account Owner:</strong> {userData.is_owner ? "Yes" : "No"}</p>
          <p><strong>Admin:</strong> {userData.is_admin ? "Yes" : "No"}</p>

          <div style={{ marginTop: "1.5rem" }}>
            <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
            <button style={{ marginLeft: "0rem" }} onClick={() => navigate("/")}>
              Go Home
            </button>
          </div>

          <div style={{ marginTop: "1rem", textAlign: "left" }}>
            <a href="/lobby" style={{ fontSize: "0.9rem" }}>← Lobby</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
