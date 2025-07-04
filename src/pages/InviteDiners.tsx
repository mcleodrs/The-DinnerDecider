import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function InviteDiners() {
  const location = useLocation();
  const eventId = new URLSearchParams(location.search).get("event_id");

  const [emails, setEmails] = useState<string[]>([""]);
  const [pastDiners, setPastDiners] = useState<string[]>([]);
  const [selectedPast, setSelectedPast] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmailChange = (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const removeEmailField = (index: number) => {
    const updated = [...emails];
    updated.splice(index, 1);
    setEmails(updated);
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
      ...emails.filter((email) => email.trim() !== ""),
      ...selectedPast,
    ];

    if (allEmails.length === 0) {
      setMessage("Please enter at least one valid email.");
      return;
    }

    setSending(true);
    setMessage("");

    const insertData = allEmails.map((email) => ({
      event_id: eventId,
      guest_email: email.trim(),
    }));

    const { error } = await supabase
      .from("event_participants")
      .insert(insertData);

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
    <div className="profile-container">
      <h1>Invite Diners</h1>

      {emails.map((email, index) => (
        <div key={index} style={{ marginBottom: "0.5rem" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(index, e.target.value)}
            placeholder="guest@example.com"
            required
          />
          {emails.length > 1 && (
            <button onClick={() => removeEmailField(index)}>Remove</button>
          )}
        </div>
      ))}

      <button onClick={addEmailField}>Add Another Guest</button>

      {pastDiners.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Invite Again:</h4>
          {pastDiners.map((email) => (
            <label
              key={email}
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              <input
                type="checkbox"
                checked={selectedPast.includes(email)}
                onChange={() => togglePastDiner(email)}
              />{" "}
              {email}
            </label>
          ))}
        </div>
      )}

      <br />
      <button onClick={inviteGuests} disabled={sending}>
        {sending ? "Sending..." : "Send Invites"}
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
