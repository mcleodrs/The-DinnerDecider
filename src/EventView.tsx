import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import VoteOnDinner from "./VoteOnDinner";
import RSVP from "./RSVP";
import VoteTallySection from "./VoteTallySection";

export default function EventView() {
  const { event_id } = useParams<{ event_id: string }>();
  const [user, setUser] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [isChef, setIsChef] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndEvent = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", event_id)
        .single();

      if (error) {
        console.error("Error loading event:", error);
      } else {
        setEvent(data);
        setIsChef(data.chef_id === user?.id);
      }

      setLoading(false);
    };

    if (event_id) fetchUserAndEvent();
  }, [event_id]);

  if (loading || !event || !user) return <div>Loading event...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        {event.event_date} @ {event.event_time} — {event.location}
      </p>
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
        {event.status}
      </span>

      <div className="mt-6">
        {isChef ? (
          <>
            <VoteTallySection eventId={event.id} />
            {/* FinalMenuSection can be added here next */}
          </>
        ) : (
          <>
            <VoteOnDinner eventId={event.id} userId={user.id} />
            <RSVP eventId={event.id} userId={user.id} />
          </>
        )}
      </div>
    </div>
  );
}
