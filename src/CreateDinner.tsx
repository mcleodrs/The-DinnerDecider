import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

type Option = {
  id: string;
  name: string;
};

export default function CreateDinner() {
  const navigate = useNavigate();

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
    const loadOptions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const fetchOptions = async (table: string) => {
        const { data } = await supabase
          .from(table)
          .select("id, name")
          .eq("chef_id", user.id);
        return data || [];
      };

      setPantryOptions(await fetchOptions("pantry_meals"));
      setDineInOptions(await fetchOptions("dine_in_options"));
      setDineOutOptions(await fetchOptions("dine_out_restaurants"));
    };

    loadOptions();
  }, []);

  const toggleSelection = (
    id: string,
    type: "pantry" | "dine_in" | "dine_out"
  ) => {
    if (type === "pantry") {
      setSelectedPantry((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else if (type === "dine_in") {
      setSelectedDineIn((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else {
      setSelectedDineOut((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    }
  };

  const createEvent = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("events")
      .insert({
        chef_id: user.id,
        title,
        location,
        event_date: eventDate,
        event_time: eventTime,
        details,
        pantry_meal_ids: selectedPantry,
        dine_in_option_ids: selectedDineIn,
        dine_out_option_ids: selectedDineOut,
      })
      .select()
      .single();

    if (error || !data) {
      alert("Failed to create event.");
      return;
    }

    navigate(`/invite-guests?event_id=${data.id}`);
  };

  const renderSelectedOptions = () => {
    const names = [
      ...selectedPantry.map(
        (id) => pantryOptions.find((opt) => opt.id === id)?.name
      ),
      ...selectedDineIn.map(
        (id) => dineInOptions.find((opt) => opt.id === id)?.name
      ),
      ...selectedDineOut.map(
        (id) => dineOutOptions.find((opt) => opt.id === id)?.name
      ),
    ].filter(Boolean);

    return names.length > 0 ? (
      <div style={{ marginBottom: "1rem" }}>
        <h4>Selected Event Options:</h4>
        <ul>
          {names.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ul>
      </div>
    ) : null;
  };

  const renderToggleButtons = (
    options: Option[],
    selected: string[],
    type: "pantry" | "dine_in" | "dine_out"
  ) => {
    const midpoint = Math.ceil(options.length / 2);
    const col1 = options.slice(0, midpoint);
    const col2 = options.slice(midpoint);

    const renderColumn = (items: Option[]) => (
      <div style={{ flex: 1 }}>
        {items.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggleSelection(opt.id, type)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                borderRadius: "0.5rem",
                border: isSelected ? "2px solid #aa8800" : "1px solid #ccc",
                backgroundColor: isSelected ? "#f9cd45" : "#f2f2f2",
                color: "#333",
                cursor: "pointer",
                fontWeight: isSelected ? "bold" : "normal",
              }}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
    );

    return (
      <div style={{ display: "flex", gap: "1rem" }}>
        {renderColumn(col1)}
        {renderColumn(col2)}
      </div>
    );
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

      {renderSelectedOptions()}

      {activeTab === "pantry" && (
        <>
          <h4>Pantry Options:</h4>
          {renderToggleButtons(pantryOptions, selectedPantry, "pantry")}
        </>
      )}
      {activeTab === "dine_in" && (
        <>
          <h4>Dine In Options:</h4>
          {renderToggleButtons(dineInOptions, selectedDineIn, "dine_in")}
        </>
      )}
      {activeTab === "dine_out" && (
        <>
          <h4>Dine Out Options:</h4>
          {renderToggleButtons(dineOutOptions, selectedDineOut, "dine_out")}
        </>
      )}

      <br />
      <button onClick={createEvent}>Create Event & Invite Guests</button>
    </div>
  );
}
