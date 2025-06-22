import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient"; // make sure you have supabaseClient.ts in place
import { useAuth } from "./auth"; // Custom hook to handle auth context

// Interface for a meal item
interface Meal {
  id: string;
  name: string;
  is_favorite: boolean;
}

const PantrySection = () => {
  const { user } = useAuth(); // Assuming you have a context that provides the current user
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      if (!user) {
        setError("User not logged in.");
        return;
      }

      try {
        // Fetch meals from Supabase pantry based on user (chefId from authenticated user)
        const { data, error } = await supabase
          .from("pantry_meals")
          .select("id, name, is_favorite")
          .eq("chef_id", user.id); // Assuming user.id is your chef's unique identifier in Supabase

        if (error) {
          throw error;
        }

        setMeals(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load pantry meals.");
      }
    };

    fetchMeals();
  }, [user]);

  const toggleFavorite = async (mealId: string) => {
    try {
      const mealToUpdate = meals.find((meal) => meal.id === mealId);
      if (!mealToUpdate) return;

      const updatedFavoriteStatus = !mealToUpdate.is_favorite;

      // Update the favorite status in the database
      const { error } = await supabase
        .from("pantry_meals")
        .update({ is_favorite: updatedFavoriteStatus })
        .eq("id", mealId);

      if (error) {
        throw error;
      }

      // Update local state to reflect the change
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === mealId
            ? { ...meal, is_favorite: updatedFavoriteStatus }
            : meal
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to toggle favorite.");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2>Your Pantry</h2>
      <div className="pantry-meals">
        {meals.length === 0 ? (
          <p>No meals found in your pantry.</p>
        ) : (
          <ul>
            {meals.map((meal) => (
              <li key={meal.id} className="meal-item">
                <span>{meal.name}</span>
                <button onClick={() => toggleFavorite(meal.id)}>
                  {meal.is_favorite
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PantrySection;
