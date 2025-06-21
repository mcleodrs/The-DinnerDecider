"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Tally = {
  vote_choice: string;
  voters: string[];
};

export default function VoteTallySection() {
  const [tallies, setTallies] = useState<Tally[]>([]);
  const [loading, setLoading] = useState(true);

  const eventId = "c578b937-2458-4319-944a-850ab4f8ad88";

  useEffect(() => {
    async function fetchTally() {
      const { data, error } = await supabase
        .from("event_votes")
        .select("vote_choice, users(full_name)")
        .eq("event_id", eventId)
        .not("user_id", "is", null);

      if (error) {
        console.error("Tally fetch error:", error);
        setTallies([]);
        setLoading(false);
        return;
      }

      // Group votes by choice
      const grouped: Record<string, string[]> = {};
      data.forEach((vote) => {
        const choice = vote.vote_choice;
        const name =
          (vote.users as { full_name?: string })?.full_name || "Anonymous";

        if (!grouped[choice]) {
          grouped[choice] = [];
        }
        grouped[choice].push(name);
      });

      const result: Tally[] = Object.entries(grouped).map(
        ([choice, voters]) => ({
          vote_choice: choice,
          voters,
        })
      );

      setTallies(result);
      setLoading(false);
    }

    fetchTally();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Vote Tally</h1>
      <h3>Event ID: {eventId}</h3>

      {loading ? (
        <p>Loading votes...</p>
      ) : tallies.length === 0 ? (
        <p>No votes have been submitted yet.</p>
      ) : (
        <ul>
          {tallies.map((item) => (
            <li key={item.vote_choice} style={{ marginBottom: "1rem" }}>
              <strong>{item.vote_choice}</strong> – {item.voters.length} vote
              {item.voters.length !== 1 ? "s" : ""}
              <ul style={{ marginTop: "0.25rem", marginLeft: "1rem" }}>
                {item.voters.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
