import { useEffect, useState, useRef } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function EditProfile() {
  const [fullName, setFullName] = useState("");
  const [uiTheme, setUiTheme] = useState("red");
  const [savedTheme, setSavedTheme] = useState("red");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("User not authenticated.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("full_name, uitheme_pref, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
      } else {
        setFullName(data.full_name || "");
        setUiTheme(data.uitheme_pref || "red");
        setSavedTheme(data.uitheme_pref || "red");
        setAvatarUrl(data.avatar_url || "");
        setEmail(user.email || "");
        updateThemeClass(data.uitheme_pref || "red");
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  const updateThemeClass = (theme: string) => {
    const appDiv = document.querySelector(".App");
    if (appDiv) appDiv.className = `App ${theme}`;
  };

  const handleThemeChange = (value: string) => {
    setUiTheme(value);
    updateThemeClass(value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      alert("Only PNG or JPEG images are allowed.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be under 2MB.");
      return;
    }

    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      await supabase.from("users").update({ avatar_url: publicUrl }).eq("id", user.id);
      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Avatar upload failed.");
    } finally {
      setUploading(false);
    }
  };

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("User not authenticated");
      setLoading(false);
      return;
    }

    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) {
        alert("Failed to update email.");
        setLoading(false);
        return;
      }
    }

    const updates = {
      id: user.id,
      full_name: fullName.trim(),
      uitheme_pref: uiTheme,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("users").upsert(updates);

    if (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } else {
      alert("Profile updated!");
      navigate("/user");
    }

    setLoading(false);
  }

  const sendPasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset",
    });
    if (error) {
      alert("Failed to send reset email.");
    } else {
      alert("Password reset email sent.");
    }
  };

  return (
    <>
      <div className="centered-container">
        <div className="profile-container">
          <h1>Edit Profile</h1>
          <form onSubmit={handleUpdateProfile}>
            {/* Avatar Upload */}
            <div>
              <label>Avatar:</label>
              <div
                style={{ margin: "0.5rem 0", cursor: uploading ? "default" : "pointer" }}
                onClick={() => !uploading && fileInputRef.current?.click()}
                title={uploading ? "Uploading..." : "Click to change avatar"}
              >
                <img
                  src={avatarUrl || "https://via.placeholder.com/100"}
                  alt="avatar"
                  width="100"
                  height="100"
                  style={{ borderRadius: "50%", border: "2px solid #ccc" }}
                />
                {uploading && <p style={{ fontSize: "0.8rem" }}>Uploading...</p>}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg"
                onChange={handleAvatarChange}
                disabled={uploading}
                style={{ display: "none" }}
              />
            </div>

            <label htmlFor="fullName">Full Name:</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label htmlFor="email" style={{ marginTop: "1rem", display: "block" }}>
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="theme" style={{ marginTop: "1rem", display: "block" }}>
              Select UI Theme:
            </label>
            <select
              id="theme"
              value={uiTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Gold</option>
            </select>

            <div style={{ marginTop: "1.5rem" }}>
              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                style={{ marginLeft: "0rem" }}
                onClick={() => navigate("/user")}
              >
                Cancel
              </button>
              {uiTheme !== savedTheme && (
                <button
                  type="button"
                  style={{ marginLeft: "1rem" }}
                  onClick={() => {
                    setUiTheme(savedTheme);
                    updateThemeClass(savedTheme);
                  }}
                >
                  Reset Theme
                </button>
              )}
            </div>
          </form>

          <div style={{ marginTop: "1rem" }}>
            <button onClick={sendPasswordReset}>Send Password Reset Email</button>
          </div>

          <div style={{ marginTop: "1rem", textAlign: "left" }}>
            <a href="/user" style={{ fontSize: "0.9rem" }}>
              ← Back to Profile
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
