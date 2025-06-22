import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Meal = {
  id: string;
  name: string;
  is_favorite: boolean;
  ingredients?: string;
  process?: string;
  secret?: string;
};

export default function PantrySection() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMealName, setNewMealName] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("pantry_meals")
      .select("*")
      .eq("chef_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error) setMeals(data || []);
  };

  const addMeal = async () => {
    if (!newMealName.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("pantry_meals")
      .insert({ name: newMealName, chef_id: user?.id, is_favorite: false });

    if (!error) {
      setNewMealName("");
      await fetchMeals();
    }
  };

  const updateMeal = async () => {
    if (!selectedMeal) return;

    const { error } = await supabase
      .from("pantry_meals")
      .update({
        name: selectedMeal.name,
        is_favorite: selectedMeal.is_favorite,
        ingredients: selectedMeal.ingredients,
        process: selectedMeal.process,
        secret: selectedMeal.secret,
      })
      .eq("id", selectedMeal.id);

    if (!error) {
      setEditing(false);
      await fetchMeals();
    }
  };

  const deleteMeal = async () => {
    if (!selectedMeal) return;

    const { error } = await supabase
      .from("pantry_meals")
      .delete()
      .eq("id", selectedMeal.id);

    if (!error) {
      setSelectedMeal(null);
      setEditing(false);
      await fetchMeals();
    }
  };

  return (
    <div className="profile-container">
      <h2>Pantry Meals</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={newMealName}
          onChange={(e) => setNewMealName(e.target.value)}
          placeholder="New meal name"
        />
        <button onClick={addMeal}>Add Meal</button>
      </div>

      {meals.length === 0 ? (
        <p>No meals added yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {meals.map((meal) => (
            <li
              key={meal.id}
              onClick={() => {
                setSelectedMeal(meal);
                setEditing(true);
              }}
              style={{
                marginBottom: "0.5rem",
                cursor: "pointer",
                backgroundColor:
                  selectedMeal?.id === meal.id ? "#f0f0f0" : "transparent",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              {meal.is_favorite ? "⭐ " : "🍽️ "}
              {meal.name}
            </li>
          ))}
        </ul>
      )}

      {editing && selectedMeal && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Edit Meal: {selectedMeal.name}</h3>
          <input
            type="text"
            value={selectedMeal.name}
            onChange={(e) =>
              setSelectedMeal({ ...selectedMeal, name: e.target.value })
            }
            placeholder="Meal Name"
          />
          <br />
          <label>
            <input
              type="checkbox"
              checked={selectedMeal.is_favorite}
              onChange={(e) =>
                setSelectedMeal({
                  ...selectedMeal,
                  is_favorite: e.target.checked,
                })
              }
            />{" "}
            Mark as Favorite
          </label>
          <br />
          <textarea
            placeholder="Ingredients"
            value={selectedMeal.ingredients || ""}
            onChange={(e) =>
              setSelectedMeal({ ...selectedMeal, ingredients: e.target.value })
            }
            style={{ width: "100%", height: "60px", marginTop: "0.5rem" }}
          />
          <textarea
            placeholder="Process (Optional)"
            value={selectedMeal.process || ""}
            onChange={(e) =>
              setSelectedMeal({ ...selectedMeal, process: e.target.value })
            }
            style={{ width: "100%", height: "60px", marginTop: "0.5rem" }}
          />
          <textarea
            placeholder="Secret (Optional)"
            value={selectedMeal.secret || ""}
            onChange={(e) =>
              setSelectedMeal({ ...selectedMeal, secret: e.target.value })
            }
            style={{ width: "100%", height: "60px", marginTop: "0.5rem" }}
          />
          <br />
          <button onClick={updateMeal}>💾 Save</button>{" "}
          <button
            onClick={deleteMeal}
            style={{ backgroundColor: "#c00", color: "#fff" }}
          >
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
}
