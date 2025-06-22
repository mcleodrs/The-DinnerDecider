import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function CreateDinner() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [details, setDetails] = useState("");
  const [dinnerType, setDinnerType] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setError("You must be logged in to create a dinner.");
        return;
      }
      setUserId(data.user.id);
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("User not authenticated.");
      return;
    }

    const { error: insertError } = await supabase.from("events").insert([
      {
        title,
        location,
        event_date: eventDate,
        event_time: eventTime,
        details,
        chef_id: userId,
        theme_color: "red",
        theme_style: "classic",
      },
    ]);

    if (insertError) {
      console.error(insertError);
      setError("Failed to create event.");
      return;
    }

    navigate("/user");
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "500px",
        margin: "2rem auto",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Create Dinner
      </h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <label>
          Title:
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Location:
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>

        <div style={{ display: "flex", gap: "1rem" }}>
          <label style={{ flex: 1 }}>
            Date:
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </label>

          <label style={{ flex: 1 }}>
            Time:
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Details:
          <textarea
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </label>

        <div>
          <p style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
            Choose Dinner Type:
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {["PANTRY", "LEFTOVERS", "DINE_IN", "DINE_OUT"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDinnerType(type)}
                style={{
                  padding: "0.5rem 1rem",
                  border:
                    dinnerType === type ? "2px solid black" : "1px solid gray",
                  backgroundColor: dinnerType === type ? "#f0c040" : "#eee",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {type.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" style={{ padding: "0.75rem", marginTop: "1rem" }}>
          Submit Dinner
        </button>
      </form>
    </div>
  );
}
