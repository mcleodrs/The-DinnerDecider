import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

type Event = {
  id: string;
  title: string;
  location: string;
  event_date: string;
  event_time: string;
  details: string;
};

type VoteOption = {
  id: string;
  vote_choice: string;
};

type RSVPProps = {
  eventId: string;
  userId: string;
};

export default function RSVP({ eventId, userId }: RSVPProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [options, setOptions] = useState<VoteOption[]>([]);
  const [selectedVote, setSelectedVote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (data) setEvent(data);
      else console.error("Event fetch error:", error);
    }

    async function loadOptions() {
      const { data, error } = await supabase
        .from("event_votes")
        .select("id, vote_choice")
        .eq("event_id", eventId)
        .is("user_id", null); // only chef-defined options

      if (data) setOptions(data);
      else console.error("Vote options error:", error);
    }

    loadEvent();
    loadOptions();
  }, [eventId]);

  const handleSubmit = async () => {
    if (!selectedVote) return;

    const { error: voteError } = await supabase.from("event_votes").insert([
      {
        event_id: eventId,
        vote_choice: selectedVote,
        user_id: userId,
        voted_at: new Date().toISOString(),
      },
    ]);

    const { error: rsvpError } = await supabase
      .from("event_participants")
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          rsvp_status: "yes",
        },
      ]);

    if (!voteError && !rsvpError) {
      setSubmitted(true);
    } else {
      console.error({ voteError, rsvpError });
      alert("Error submitting RSVP.");
    }
  };

  if (!event) return <p>Loading event...</p>;
  if (submitted) return <p>✅ Thank you for your RSVP!</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{event.title}</h1>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Date:</strong> {event.event_date}
      </p>
      <p>
        <strong>Time:</strong> {event.event_time}
      </p>
      <p>
        <strong>Details:</strong> {event.details}
      </p>

      <h3>Vote for Dinner:</h3>
      {options.map((opt) => (
        <label key={opt.id} style={{ display: "block", margin: "0.5rem 0" }}>
          <input
            type="radio"
            name="vote"
            value={opt.vote_choice}
            checked={selectedVote === opt.vote_choice}
            onChange={(e) => setSelectedVote(e.target.value)}
          />
          {opt.vote_choice}
        </label>
      ))}

      <button
        disabled={!selectedVote}
        onClick={handleSubmit}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Submit RSVP
      </button>
    </div>
  );
}
