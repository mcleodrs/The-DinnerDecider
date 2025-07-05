import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function InviteDiners() {
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = new URLSearchParams(location.search).get("event_id");

  const [emailInput, setEmailInput] = useState("");
  const [guests, setGuests] = useState<{ email: string; checked: boolean }[]>([]);
  const [pastDiners, setPastDiners] = useState<string[]>([]);
  const [selectedPast, setSelectedPast] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddGuest = () => {
    const trimmed = emailInput.trim();
    if (!trimmed || guests.some((g) => g.email === trimmed)) return;
    setGuests([...guests, { email: trimmed, checked: false }]);
    setEmailInput("");
  };

  const toggleGuestCheck = (index: number) => {
    const updated = [...guests];
    updated[index].checked = !updated[index].checked;
    setGuests(updated);
  };

  const handleRemoveChecked = () => {
    setGuests(guests.filter((g) => !g.checked));
  };

  const togglePastDiner = (email: string) => {
    setSelectedPast((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const inviteGuests = async () => {
    if (!eventId) {
      setMessage("Invalid event. Please try again.");
      return;
    }

    const allEmails = [
      ...guests.map((g) => g.email),
      ...selectedPast,
    ].filter((email, i, arr) => arr.indexOf(email) === i); // unique

    if (allEmails.length === 0) {
      setMessage("Please enter at least one guest.");
      return;
    }

    setSending(true);
    setMessage("");

    const insertData = allEmails.map((email) => ({
      event_id: eventId,
      guest_email: email,
    }));

    const { error } = await supabase.from("event_participants").insert(insertData);

    if (error) {
      console.error(error);
      setMessage("Failed to invite guests.");
    } else {
      setMessage("Guests invited successfully!");
    }

    setSending(false);
  };

  useEffect(() => {
    const fetchPastDiners = async () => {
      const { data, error } = await supabase
        .from("event_participants")
        .select("guest_email");

      if (error) {
        console.error("Failed to load past diners:", error);
        return;
      }

      const emails = (data || [])
        .map((entry) => entry.guest_email)
        .filter((email): email is string => Boolean(email));

      const uniqueEmails = Array.from(new Set(emails));
      setPastDiners(uniqueEmails);
    };

    fetchPastDiners();
  }, []);

  return (
    <div className="centered-container">
      <div className="profile-container">
        <h1>Invite Diners</h1>

        {/* Input Row */}
        <div className="form-row" style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="email"
            placeholder="guest@example.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" className="action-button" onClick={handleAddGuest}>
            Add
          </button>
          <button
            type="button"
            className="action-button"
            onClick={handleRemoveChecked}
            style={{ backgroundColor: "#aa3333" }}
          >
            Remove Selected
          </button>
        </div>

        {/* Guest List */}
        <ul style={{ marginTop: "1rem", paddingLeft: 0 }}>
          {guests.map((guest, index) => (
            <li
              key={guest.email}
              style={{
                listStyle: "none",
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <input
                type="checkbox"
                checked={guest.checked}
                onChange={() => toggleGuestCheck(index)}
                style={{ marginRight: "0.5rem" }}
              />
              {guest.email}
            </li>
          ))}
        </ul>

        {/* Past Diners */}
        {pastDiners.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h4>Invite Again:</h4>
            {pastDiners.map((email) => (
              <label key={email} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={selectedPast.includes(email)}
                  onChange={() => togglePastDiner(email)}
                  style={{ marginRight: "0.5rem" }}
                />
                {email}
              </label>
            ))}
          </div>
        )}

        {/* Buttons */}
        <button
          className="action-button"
          onClick={inviteGuests}
          disabled={sending}
          style={{ marginTop: "1rem" }}
        >
          {sending ? "Sending..." : "Send Invites"}
        </button>

        {/* Back Link */}
        <div style={{ marginTop: "1rem", textAlign: "left" }}>
          <a href="/CreateDinner" style={{ fontSize: "0.9rem" }}>
            ← Back to Profile
          </a>
        </div>

        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
      </div>
    </div>
  );
}
