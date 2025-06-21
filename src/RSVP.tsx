"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

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

export default function RSVP({ eventId }: { eventId: string }) {
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
    }

    async function loadOptions() {
      const { data } = await supabase
        .from("event_votes")
        .select("id, vote_choice")
        .eq("event_id", eventId)
        .is("user_id", null); // only original menu options

      if (data) setOptions(data);
    }

    loadEvent();
    loadOptions();
  }, [eventId]);

  const handleSubmit = async () => {
    const userId = "00000000-0000-0000-0000-000000000002"; // Example diner

    // Save vote
    const { error: voteError } = await supabase.from("event_votes").insert([
      {
        event_id: eventId,
        vote_choice: selectedVote,
        user_id: userId,
        voted_at: new Date().toISOString(),
      },
    ]);

    // Save RSVP
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
      alert("Error submitting RSVP");
    }
  };

  if (!event) return <p>Loading event...</p>;
  if (submitted) return <p>Thank you for your RSVP!</p>;

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
        <label key={opt.id}>
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

      <br />
      <br />
      <button disabled={!selectedVote} onClick={handleSubmit}>
        Submit RSVP
      </button>
    </div>
  );
}
