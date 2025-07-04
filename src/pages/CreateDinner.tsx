import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import Footer from "../components/Footer";

type Option = {
  id: string;
  name: string;
};

type OptionType = "pantry" | "dine_in" | "dine_out";

export default function CreateDinner() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<OptionType>("pantry");

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

  const toggleSelection = (id: string, type: OptionType) => {
    const mapping: Record<
      OptionType,
      [string[], React.Dispatch<React.SetStateAction<string[]>>]
    > = {
      pantry: [selectedPantry, setSelectedPantry],
      dine_in: [selectedDineIn, setSelectedDineIn],
      dine_out: [selectedDineOut, setSelectedDineOut],
    };

    const [current, set] = mapping[type];
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    set(updated);
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .insert({
        chef_id: user.id,
        title,
        location,
        event_date: eventDate,
        event_time: eventTime,
        details,
      })
      .select()
      .single();

    if (error || !data) {
      alert("Failed to create event.");
      return;
    }

    const eventId = data.id;

    const allOptions = [
      ...selectedPantry.map((id) => ({
        event_id: eventId,
        option_id: id,
        option_type: "pantry",
        label: pantryOptions.find((opt) => opt.id === id)?.name || "Unnamed",
        created_by: user.id,
      })),
      ...selectedDineIn.map((id) => ({
        event_id: eventId,
        option_id: id,
        option_type: "dine_in",
        label: dineInOptions.find((opt) => opt.id === id)?.name || "Unnamed",
        created_by: user.id,
      })),
      ...selectedDineOut.map((id) => ({
        event_id: eventId,
        option_id: id,
        option_type: "dine_out",
        label: dineOutOptions.find((opt) => opt.id === id)?.name || "Unnamed",
        created_by: user.id,
      })),
    ];

    const { error: insertError } = await supabase
      .from("event_dinner_options")
      .insert(allOptions);

    if (insertError) {
      console.error("Insert error:", insertError.message, allOptions);
      alert("Event created but options failed to save.");
      return;
    }

    navigate(`/invite-diners?event_id=${eventId}`);
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

  const renderOptionGrid = (
    options: Option[],
    selected: string[],
    type: OptionType
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
              type="button"
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
    <>
      <div className="centered-container">
        <div className="profile-container">
          <div className="event-form-container">
            <h1 className="form-title">Create Event</h1>

            <form onSubmit={createEvent} className="event-form">
              <div className="form-row">
                <label htmlFor="title">Event Title: </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label htmlFor="location">Location: </label>
                <input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="form-row two-col">
                <div>
                  <label htmlFor="date">Date: </label>
                  <input
                    id="date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="time">Time: </label>
                  <input
                    id="time"
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
                <br />
              </div>

              <div className="form-row">
                <label htmlFor="details">Details:</label>
                <textarea
                  id="details"
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>
              <button type="submit" className="action-button" style={{ marginTop: "1rem" }}>
                Create Event & Invite Guests
              </button>
              <h2 className="section-title">Choose Event Options:</h2>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <button type="button" onClick={() => setActiveTab("pantry")}>
                  🧺 Pantry
                </button>
                <button type="button" onClick={() => setActiveTab("dine_in")}>
                  🏠 Dine In
                </button>
                <button type="button" onClick={() => setActiveTab("dine_out")}>
                  🍔 Dine Out
                </button>
              </div>

              {renderSelectedOptions()}

              {activeTab === "pantry" && (
                <>
                  <h4>Pantry Options:</h4>
                  {renderOptionGrid(pantryOptions, selectedPantry, "pantry")}
                </>
              )}
              {activeTab === "dine_in" && (
                <>
                  <h4>Dine In Options:</h4>
                  {renderOptionGrid(dineInOptions, selectedDineIn, "dine_in")}
                </>
              )}
              {activeTab === "dine_out" && (
                <>
                  <h4>Dine Out Options:</h4>
                  {renderOptionGrid(dineOutOptions, selectedDineOut, "dine_out")}
                </>
              )}


            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
