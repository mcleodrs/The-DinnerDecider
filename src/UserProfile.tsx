import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [uiTheme, setUiTheme] = useState("red");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email, role, uitheme_pref")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setUiTheme(data.uitheme_pref || "red");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from("users")
      .update({ full_name: fullName, uitheme_pref: uiTheme })
      .eq("id", profile.id);

    setMessage(error ? "Update failed." : "Profile updated.");
  };

  const handleSendVerification = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: profile.email,
    });

    setMessage(error ? "Failed to resend email." : "Verification email sent.");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>User Profile</h1>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Role:</strong> {profile.role}
      </p>
      <div>
        <label>
          <strong>Full Name:</strong>
          <br />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Theme Preference:</strong>
          <br />
          <select value={uiTheme} onChange={(e) => setUiTheme(e.target.value)}>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>
      </div>
      <br />
      <button onClick={handleUpdate}>Save Profile</button>
      <button onClick={handleSendVerification} style={{ marginLeft: "1rem" }}>
        Resend Verification Email
      </button>
      <br />
      <br />
      <button onClick={handleSignOut}>Sign Out</button>
      {message && <p>{message}</p>}
    </div>
  );
}
