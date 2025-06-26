import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type VoteOnDinnerProps = {
  eventId: string;
  userId: string;
};

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

export default function VoteOnDinner({ eventId, userId }: VoteOnDinnerProps) {
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [voteOptions, setVoteOptions] = useState<VoteOption[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    fetchEventAndOptions();
  }, [eventId]);

  async function fetchEventAndOptions() {
    // Fetch event details
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("title, location, event_date, event_time, details")
      .eq("id", eventId)
      .single();

    if (eventData) {
      setEvent(eventData);
    } else {
      console.error("Event load error:", eventError);
    }

    // Fetch vote options and user's vote
    const { data: voteData, error: voteError } = await supabase
      .from("event_votes")
      .select("*")
      .eq("event_id", eventId);

    if (voteData) {
      // Options to vote for (user_id is null)
      setVoteOptions(voteData.filter((v) => v.user_id === null));

      // Detect if user already voted
      const userVote = voteData.find((v) => v.user_id === userId);
      if (userVote) {
        setAlreadyVoted(true);
        setSelected(userVote.vote_choice);
      }
    } else {
      console.error("Vote options load error:", voteError);
    }
  }

  async function handleVoteSubmit() {
    if (!selected) return alert("Please select an option to vote.");

    const { error } = await supabase.from("event_votes").insert([
      {
        event_id: eventId,
        user_id: userId,
        vote_choice: selected,
        voted_at: new Date().toISOString(),
      },
    ]);

    if (!error) {
      alert("Vote submitted!");
      setAlreadyVoted(true);
      fetchEventAndOptions();
    } else {
      console.error("Submit error:", error);
      alert("There was an error submitting your vote.");
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1 className="text-xl font-semibold mb-4">RSVP & Vote</h1>

      {event ? (
        <div className="mb-6">
          <h2 className="text-lg font-bold">{event.title}</h2>
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

      {alreadyVoted ? (
        <p>
          ✅ You already voted for: <strong>{selected}</strong>
        </p>
      ) : (
        <>
          <h3 className="font-medium mb-2">Choose Your Dinner:</h3>
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
          <button
            onClick={handleVoteSubmit}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
          >
            RSVP + Submit Vote
          </button>
        </>
      )}
    </main>
  );
}
