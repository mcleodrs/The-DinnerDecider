import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Option = {
  id: string;
  name: string;
};

export default function CreateDinner() {
  const [activeTab, setActiveTab] = useState<"pantry" | "dine_in" | "dine_out">(
    "pantry"
  );

  const [pantryOptions, setPantryOptions] = useState<Option[]>([]);
  const [dineInOptions, setDineInOptions] = useState<Option[]>([]);
  const [dineOutOptions, setDineOutOptions] = useState<Option[]>([]);

  const [selectedPantry, setSelectedPantry] = useState<string[]>([]);
  const [selectedDineIn, setSelectedDineIn] = useState<string[]>([]);
  const [selectedDineOut, setSelectedDineOut] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    loadAllOptions();
  }, []);

  async function loadAllOptions() {
    const user = (await supabase.auth.getUser()).data.user;

    const fetch = async (table: string) => {
      const { data, error } = await supabase
        .from(table)
        .select("id, name")
        .eq("chef_id", user?.id);
      return data || [];
    };

    setPantryOptions(await fetch("pantry_meals"));
    setDineInOptions(await fetch("dine_in_options"));
    setDineOutOptions(await fetch("dine_out_restaurants"));
  }

  const handleToggle = (
    id: string,
    type: "pantry" | "dine_in" | "dine_out"
  ) => {
    const stateSetter = {
      pantry: setSelectedPantry,
      dine_in: setSelectedDineIn,
      dine_out: setSelectedDineOut,
    }[type];

    const stateGetter = {
      pantry: selectedPantry,
      dine_in: selectedDineIn,
      dine_out: selectedDineOut,
    }[type];

    const updated = stateGetter.includes(id)
      ? stateGetter.filter((x) => x !== id)
      : [...stateGetter, id];

    stateSetter(updated);
  };

  const handleSubmit = () => {
    alert("Submit logic will go here");
  };

  const renderSelectionList = () => {
    const allSelected = [
      ...selectedPantry.map(
        (id) => pantryOptions.find((opt) => opt.id === id)?.name || ""
      ),
      ...selectedDineIn.map(
        (id) => dineInOptions.find((opt) => opt.id === id)?.name || ""
      ),
      ...selectedDineOut.map(
        (id) => dineOutOptions.find((opt) => opt.id === id)?.name || ""
      ),
    ].filter(Boolean);

    return allSelected.length > 0 ? (
      <div style={{ marginBottom: "1rem" }}>
        <h4>Selected Event Options:</h4>
        <ul>
          {allSelected.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    ) : null;
  };

  return (
    <div className="profile-container">
      <h1>Create Event</h1>

      <label>Event Title:</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Location:</label>
      <input value={location} onChange={(e) => setLocation(e.target.value)} />

      <label>Date:</label>
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />

      <label>Time:</label>
      <input
        type="time"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
      />

      <label>Details:</label>
      <textarea value={details} onChange={(e) => setDetails(e.target.value)} />

      <h3>Choose Event Options:</h3>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <button onClick={() => setActiveTab("pantry")}>🧺 Pantry</button>
        <button onClick={() => setActiveTab("dine_in")}>🏠 Dine In</button>
        <button onClick={() => setActiveTab("dine_out")}>🍔 Dine Out</button>
      </div>

      {renderSelectionList()}

      <br />
      <button onClick={handleSubmit}>Create Event</button>

      {activeTab === "pantry" && (
        <div>
          <h4>Pantry Options:</h4>
          {pantryOptions.map((item) => (
            <label key={item.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={selectedPantry.includes(item.id)}
                onChange={() => handleToggle(item.id, "pantry")}
              />
              {item.name}
            </label>
          ))}
        </div>
      )}

      {activeTab === "dine_in" && (
        <div>
          <h4>Dine In Options:</h4>
          {dineInOptions.map((item) => (
            <label key={item.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={selectedDineIn.includes(item.id)}
                onChange={() => handleToggle(item.id, "dine_in")}
              />
              {item.name}
            </label>
          ))}
        </div>
      )}

      {activeTab === "dine_out" && (
        <div>
          <h4>Dine Out Options:</h4>
          {dineOutOptions.map((item) => (
            <label key={item.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={selectedDineOut.includes(item.id)}
                onChange={() => handleToggle(item.id, "dine_out")}
              />
              {item.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
