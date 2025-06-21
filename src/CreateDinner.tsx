import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

type PantryMeal = {
  id: string;
  name: string;
  is_favorite: boolean;
};

export default function CreateDinner() {
  const [pantryMeals, setPantryMeals] = useState<PantryMeal[]>([]);
  const [selectedMealId, setSelectedMealId] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch authenticated user + their pantry meals
  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Could not retrieve user.");
        return;
      }

      setUserId(user.id);

      const { data, error: pantryError } = await supabase
        .from("pantry_meals")
        .select("id, name, is_favorite")
        .eq("chef_id", user.id);

      if (pantryError) {
        setError("Failed to load pantry meals.");
      } else {
        setPantryMeals(data as PantryMeal[]);
      }
    }

    fetchData();
  }, []);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!userId || !selectedMealId) {
      setError("Missing required information.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("events").insert([
      {
        chef_id: userId,
        meal_id: selectedMealId,
        // You may add: location, time, details, etc.
      },
    ]);

    setLoading(false);

    if (insertError) {
      setError("Failed to create event: " + insertError.message);
    } else {
      navigate("/dashboard"); // Or wherever you want to go after success
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Dinner Event</h2>

      <form onSubmit={handleCreateEvent}>
        <label>
          Select a Meal:
          <select
            value={selectedMealId}
            onChange={(e) => setSelectedMealId(e.target.value)}
            required
          >
            <option value="">-- Select One --</option>
            {pantryMeals.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.name}
              </option>
            ))}
          </select>
        </label>

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Dinner"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
