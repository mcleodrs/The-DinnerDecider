import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Tally = {
  vote_choice: string;
  voters: string[];
};

type VoteTallySectionProps = {
  eventId: string;
};

export default function VoteTallySection({ eventId }: VoteTallySectionProps) {
  const [tallies, setTallies] = useState<Tally[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [eventId]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Vote Tally</h2>

      {loading ? (
        <p>Loading votes...</p>
      ) : tallies.length === 0 ? (
        <p>No votes have been submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {tallies.map((item) => (
            <li key={item.vote_choice}>
              <strong>{item.vote_choice}</strong> – {item.voters.length} vote
              {item.voters.length !== 1 ? "s" : ""}
              <ul className="ml-4 list-disc text-sm mt-1">
                {item.voters.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
