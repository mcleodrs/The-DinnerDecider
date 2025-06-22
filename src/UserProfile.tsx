import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User fetch error", userError);
        setError("You are not logged in.");
        setLoading(false);
        navigate("/login");
        return;
      }

      console.log("User ID:", user.id);

      const { data, error } = await supabase
        .from("users")
        .select("full_name, email, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Supabase query error", error);
        setError("Could not load user profile.");
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>User Profile</h1>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Full Name:</strong> {profile.full_name}
      </p>
      <p>
        <strong>Role:</strong> {profile.role}
      </p>
    </div>
  );
}
