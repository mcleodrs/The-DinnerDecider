import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  uitheme_pref: string;
  is_owner: boolean;
}

interface Event {
  id: string;
  title: string;
  location: string;
  event_date: string;
  event_time: string;
  details: string;
  theme_color: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState("");
  const [themePref, setThemePref] = useState("red");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [eventIndex, setEventIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("You must be logged in to view your profile.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setEditName(profileData.full_name);
        setThemePref(profileData.uitheme_pref || "red");
        document.body.className = profileData.uitheme_pref || "red";
      }

      const today = new Date().toISOString().split("T")[0];

      /*const { data: upcomingEvents } = await supabase
        .from("events")
        .select("*")
        .eq("chef_id", user.id)
        .gte("event_date", today)
        .order("event_date", { ascending: true });*/
      const { data: upcomingEvents, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("chef_id", user.id);

      if (upcomingEvents) setEvents(upcomingEvents);

      setLoading(false);
    }

    fetchData();
  }, [navigate]);

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);

    const { error: updateError } = await supabase
      .from("users")
      .update({ full_name: editName, uitheme_pref: themePref })
      .eq("id", profile.id);

    if (!updateError) {
      setProfile({ ...profile, full_name: editName, uitheme_pref: themePref });
      document.body.className = themePref;
    } else {
      console.error(updateError);
      setError("Failed to update profile.");
    }

    setIsSaving(false);
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading profile...</p>;
  if (error) return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      <h1>User Profile</h1>

      <div>
        <label>
          Name:
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Email:
          <input type="text" value={profile?.email || ""} disabled />
        </label>
      </div>

      <div>
        <label>
          Role:
          <input type="text" value={profile?.role || ""} disabled />
        </label>
      </div>

      <div>
        <label>
          Theme Preference:
          <select
            value={themePref}
            onChange={(e) => setThemePref(e.target.value)}
          >
            <option value="red">Red (Default)</option>
            <option value="blue">Blue</option>
            <option value="dark">Dark</option>
            <option value="green">Green</option>
            <option value="brown">Brown</option>
          </select>
        </label>
      </div>

      <br />
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </button>

      <hr />

      {profile?.role === "Chef" && (
        <button onClick={() => navigate("/dashboard")}>
          Go to Chef Dashboard
        </button>
      )}

      <br />
      <br />
      <button onClick={() => navigate("/create-event")}>➕ Create Event</button>

      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No upcoming events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.title}</strong> – {event.event_date} @{" "}
              {event.event_time} – {event.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
