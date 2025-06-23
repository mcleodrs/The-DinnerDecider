import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function InviteGuests() {
  const location = useLocation();
  const eventId = new URLSearchParams(location.search).get("event_id");

  const [emails, setEmails] = useState<string[]>([""]);
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

  const inviteGuests = async () => {
    if (!eventId) {
      setMessage("Invalid event. Please try again.");
      return;
    }

    const validEmails = emails.filter((email) => email.trim() !== "");
    if (validEmails.length === 0) {
      setMessage("Please enter at least one valid email.");
      return;
    }

    setSending(true);
    setMessage("");

    const insertData = validEmails.map((email) => ({
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

  return (
    <div className="profile-container">
      <h1>Invite Guests</h1>
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
      <br />
      <br />
      <button onClick={inviteGuests} disabled={sending}>
        {sending ? "Sending..." : "Send Invites"}
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
