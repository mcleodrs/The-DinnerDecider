import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import PantrySection from "./PantrySection";
import DineInSection from "./DineInSection";
import DineOutSection from "./DineOutSection";

type Profile = {
  full_name: string;
  role: string;
};

export default function ChefDashboard() {
  const [activeTab, setActiveTab] = useState<"pantry" | "dine_in" | "dine_out">(
    "pantry"
  );
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) {
        console.error("Not authenticated or error:", authError);
        setError("You must be logged in to access the dashboard.");
        navigate("/login");
        return;
      }

      const { data, error: dbError } = await supabase
        .from("users")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (dbError) {
        console.error("Error loading profile:", dbError);
        setError("Failed to load profile.");
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  if (loading) return <p style={{ padding: "2rem" }}>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red", padding: "2rem" }}>{error}</p>;

  return (
    <div
      style={{
        backgroundImage: 'url("/project/workspace/public/AppBackGround.png")',
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      {
        <main style={{ padding: "2rem" }}>
          <h1>Chef’s Dashboard</h1>

          {profile && (
            <div style={{ marginBottom: "1rem" }}>
              <h2>Welcome, {profile.full_name}!</h2>
              <p>
                You are logged in as a <strong>{profile.role}</strong>.
              </p>
            </div>
          )}

          {/* Tab Navigation */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <button
              onClick={() => setActiveTab("pantry")}
              style={tabStyle(activeTab === "pantry")}
            >
              🧺 Pantry
            </button>
            <button
              onClick={() => setActiveTab("dine_in")}
              style={tabStyle(activeTab === "dine_in")}
            >
              🏠 Dine In
            </button>
            <button
              onClick={() => setActiveTab("dine_out")}
              style={tabStyle(activeTab === "dine_out")}
            >
              🍔 Dine Out
            </button>
          </div>

          {/* Active Section */}
          <div style={{ marginTop: "1rem" }}>
            {activeTab === "pantry" && <PantrySection />}
            {activeTab === "dine_in" && <DineInSection />}
            {activeTab === "dine_out" && <DineOutSection />}
          </div>

          {/* Future Actions */}
          <div style={{ marginTop: "2rem" }}>
            <button onClick={() => navigate("/create-event")}>
              ➕ Create Event
            </button>
            <br />
            <br />
            <button onClick={() => alert("📅 Calendar view coming soon!")}>
              📅 View Calendar
            </button>
          </div>
        </main>
      }
    </div>
  );
}

function tabStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: "0.5rem 1rem",
    backgroundColor: isActive ? "#f0c040" : "#eee",
    border: isActive ? "2px solid #444" : "1px solid #ccc",
    borderRadius: "0.5rem",
    cursor: "pointer",
  };
}
