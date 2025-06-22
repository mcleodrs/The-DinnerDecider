import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import PantrySection from "./PantrySection";
import DineInSection from "./DineInSection";
import DineOutSection from "./DineOutSection";
import { useNavigate } from "react-router-dom";

type Profile = {
  full_name: string;
  role: string;
};

export default function ChefDashboard() {
  const [activeTab, setActiveTab] = useState<"pantry" | "dine_in" | "dine_out">(
    "pantry"
  );
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

      const { data, error } = await supabase
        .from("users")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (!error) setProfile(data);
    }

    loadProfile();
  }, [navigate]);

  return (
    <main className="profile-container">
      <h1>Chef’s Dashboard</h1>

      {profile && (
        <div style={{ marginBottom: "1rem" }}>
          <h2>Welcome, {profile.full_name}!</h2>
          <p>
            You are logged in as a <strong>{profile.role}</strong>.
          </p>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveTab("pantry")}
          className={activeTab === "pantry" ? "active-tab" : ""}
        >
          🧺 Pantry
        </button>
        <button
          onClick={() => setActiveTab("dine_in")}
          className={activeTab === "dine_in" ? "active-tab" : ""}
        >
          🏠 Dine In
        </button>
        <button
          onClick={() => setActiveTab("dine_out")}
          className={activeTab === "dine_out" ? "active-tab" : ""}
        >
          🍔 Dine Out
        </button>
      </div>

      <div>
        {activeTab === "pantry" && <PantrySection />}
        {activeTab === "dine_in" && <DineInSection />}
        {activeTab === "dine_out" && <DineOutSection />}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate("/create-event")}>
          ➕ Create Event
        </button>
        <br />
        <br />
        <button onClick={() => alert("Show calendar view soon!")}>
          📅 View Calendar
        </button>
      </div>
    </main>
  );
}
