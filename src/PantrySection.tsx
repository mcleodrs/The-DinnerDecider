"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Meal = {
  id: string;
  chef_id: string;
  name: string;
  is_favorite: boolean;
  created_at: string;
};

export default function PantrySection() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMealName, setNewMealName] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editedMealName, setEditedMealName] = useState("");

  const chefId = "00000000-0000-0000-0000-000000000001"; // Hardcoded Chef

  useEffect(() => {
    fetchMeals();
  }, []);

  async function fetchMeals() {
    const { data, error } = await supabase
      .from("pantry_meals")
      .select("*")
      .eq("chef_id", chefId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error loading meals:", error);
    else setMeals(data || []);
  }

  async function addMeal() {
    if (!newMealName.trim()) return;

    const { error } = await supabase.from("pantry_meals").insert([
      {
        chef_id: chefId,
        name: newMealName.trim(),
        is_favorite: false,
      },
    ]);

    if (!error) {
      setNewMealName("");
      fetchMeals();
    } else {
      console.error("Error adding meal:", error);
    }
  }

  async function deleteMeal(id: string) {
    const { error } = await supabase.from("pantry_meals").delete().eq("id", id);
    if (!error) fetchMeals();
  }

  async function toggleFavorite(meal: Meal) {
    const { error } = await supabase
      .from("pantry_meals")
      .update({ is_favorite: !meal.is_favorite })
      .eq("id", meal.id);

    if (!error) fetchMeals();
  }

  async function updateMeal(id: string) {
    if (!editedMealName.trim()) return;

    const { error } = await supabase
      .from("pantry_meals")
      .update({ name: editedMealName.trim() })
      .eq("id", id);

    if (!error) {
      setEditingMealId(null);
      setEditedMealName("");
      fetchMeals();
    } else {
      console.error("Error updating meal:", error);
    }
  }

  return (
    <div>
      <h2>Pantry Meals</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newMealName}
          onChange={(e) => setNewMealName(e.target.value)}
          placeholder="Add a new meal..."
        />
        <button onClick={addMeal} style={{ marginLeft: "0.5rem" }}>
          ➕ Add
        </button>
      </div>

      <button
        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        style={{ marginBottom: "1rem" }}
      >
        {showFavoritesOnly ? "👁️ Show All" : "⭐ Show Favorites Only"}
      </button>

      {meals.length === 0 ? (
        <p>No meals saved yet.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {meals
            .filter((meal) => !showFavoritesOnly || meal.is_favorite)
            .map((meal) => (
              <li
                key={meal.id}
                style={{
                  fontWeight: meal.is_favorite ? "bold" : "normal",
                  backgroundColor: meal.is_favorite ? "#fff7e6" : "transparent",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                }}
              >
                <span>
                  {editingMealId === meal.id ? (
                    <>
                      <input
                        type="text"
                        value={editedMealName}
                        onChange={(e) => setEditedMealName(e.target.value)}
                        style={{ marginRight: "0.5rem" }}
                      />
                      <button onClick={() => updateMeal(meal.id)}>
                        💾 Save
                      </button>
                      <button
                        onClick={() => setEditingMealId(null)}
                        style={{ marginLeft: "0.25rem" }}
                      >
                        ✖️ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {meal.is_favorite && (
                        <span style={{ marginRight: "0.5rem" }}>⭐</span>
                      )}
                      {meal.name}
                    </>
                  )}
                </span>
                {editingMealId !== meal.id && (
                  <>
                    <button
                      onClick={() => toggleFavorite(meal)}
                      style={{ marginLeft: "1rem" }}
                    >
                      {meal.is_favorite ? "Unfavorite" : "Favorite"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingMealId(meal.id);
                        setEditedMealName(meal.name);
                      }}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      ❌ Delete
                    </button>
                  </>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
