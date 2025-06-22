import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

interface UserProfileData {
  full_name: string;
  email: string;
  role: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error:", authError);
        setError("You must be logged in to view your profile.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const { data, error: dbError } = await supabase
        .from("users")
        .select("full_name, email, role")
        .eq("id", user.id)
        .single();

      if (dbError) {
        console.error("Profile load error:", dbError);
        setError("Could not load user profile.");
      } else {
        setProfile(data);
        setEditName(data.full_name || "");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: updateError } = await supabase
      .from("users")
      .update({ full_name: editName })
      .eq("id", user?.id);

    if (updateError) {
      console.error(updateError);
      setError("Failed to update profile.");
    } else {
      setProfile((prev) => prev && { ...prev, full_name: editName });
    }

    setIsSaving(false);
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading profile...</p>;
  if (error) return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "480px", margin: "auto" }}>
      <h1>User Profile</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Email:
          <input
            type="text"
            value={profile?.email || ""}
            disabled
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Full Name:
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Role:
          <input
            type="text"
            value={profile?.role || "unknown"}
            disabled
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
