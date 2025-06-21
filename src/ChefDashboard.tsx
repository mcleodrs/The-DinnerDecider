import { useState } from "react";
import PantrySection from "./PantrySection";
import DineOutSection from "./DineOutSection";
import DineInSection from "./DineInSection";

export default function ChefDashboard() {
  const [activeTab, setActiveTab] = useState<"pantry" | "dine_in" | "dine_out">(
    "pantry"
  );

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Chef’s Dashboard</h1>

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
    </main>
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
