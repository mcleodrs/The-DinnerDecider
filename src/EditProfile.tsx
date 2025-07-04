import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [fullName, setFullName] = useState("");
  const [uiTheme, setUiTheme] = useState("red");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("User not authenticated.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("full_name, uitheme_pref")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
      } else {
        setFullName(data.full_name || "");
        setUiTheme(data.uitheme_pref || "red");
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated.");
      setLoading(false);
      return;
    }

    const updates = {
      id: user.id,
      full_name: fullName,
      uitheme_pref: uiTheme,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("users").upsert(updates);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      navigate("/user");
    }

    setLoading(false);
  }

  return (
    <div className="auth-container">
      <h1>Edit Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <select value={uiTheme} onChange={(e) => setUiTheme(e.target.value)}>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="brown">Brown</option>
          <option value="dark">Dark</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
      <div style={{ marginTop: "1rem", textAlign: "left" }}>
        <a href="/user" style={{ fontSize: "0.9rem" }}>← Back to Profile</a>
      </div>
    </div>
  );
}
