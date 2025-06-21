"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type EventDetails = {
  title: string;
  location: string;
  event_date: string;
  event_time: string;
  details: string;
};

type VoteOption = {
  id: string;
  vote_choice: string;
  user_id: string | null;
};

export default function VoteOnDinner() {
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [voteOptions, setVoteOptions] = useState<VoteOption[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);

  const eventId = "c578b937-2458-4319-944a-850ab4f8ad88"; // Replace with your actual event.id
  const dinerId = "00000000-0000-0000-0000-000000000003"; // Replace with current user for now

  useEffect(() => {
    fetchEventAndOptions();
  }, []);

  async function fetchEventAndOptions() {
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("title, location, event_date, event_time, details")
      .eq("id", eventId)
      .single();

    if (eventData) setEvent(eventData);
    else console.error("Event load error:", eventError);

    const { data: voteData, error: voteError } = await supabase
      .from("event_votes")
      .select("*")
      .eq("event_id", eventId);

    if (voteData) {
      setVoteOptions(voteData.filter((v) => v.user_id === null));
      setParticipants(
        voteData
          .filter((v) => v.user_id && v.user_id !== null)
          .map((v) => v.user_id as string)
      );
    } else {
      console.error("Vote options load error:", voteError);
    }
  }

  async function handleVoteSubmit() {
    if (!selected) return alert("Please select an option to vote.");

    const { error } = await supabase.from("event_votes").insert([
      {
        event_id: eventId,
        user_id: dinerId,
        vote_choice: selected,
        voted_at: new Date().toISOString(),
      },
    ]);

    if (!error) {
      alert("Vote submitted!");
      fetchEventAndOptions();
    } else {
      console.error(error);
      alert("There was an error submitting your vote.");
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>RSVP & Vote</h1>
      {event ? (
        <div style={{ marginBottom: "1.5rem" }}>
          <h2>{event.title}</h2>
          <p>
            <strong>When:</strong> {event.event_date} at {event.event_time}
          </p>
          <p>
            <strong>Where:</strong> {event.location}
          </p>
          <p>{event.details}</p>
        </div>
      ) : (
        <p>Loading event details...</p>
      )}
      <h3>Choose Your Dinner:</h3>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {voteOptions.map((option) => (
          <li key={option.vote_choice}>
            <label>
              <input
                type="radio"
                name="vote"
                value={option.vote_choice}
                checked={selected === option.vote_choice}
                onChange={() => setSelected(option.vote_choice)}
              />
              {option.vote_choice}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleVoteSubmit} style={{ marginTop: "1rem" }}>
        RSVP + Submit Vote
      </button>
      <hr style={{ margin: "2rem 0" }} />
      {/*<h3>Other Participants</h3>
      {participants.length > 0 ? (
        <ul>
          {participants.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      ) : (
        <p>No one has RSVP’d yet.</p>
      )}*/}
    </main>
  );
}
