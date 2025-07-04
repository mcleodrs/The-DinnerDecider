import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../auth/auth";
import { useNavigate } from "react-router-dom";

type PantryMeal = {
  id: string;
  chef_id: string;
  name: string;
  favorite?: boolean;
  ingredients?: string;
  notes?: string;
  secrets?: string;
};

export default function PantrySection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meals, setMeals] = useState<PantryMeal[]>([]);
  const [newMealName, setNewMealName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    ingredients: "",
    notes: "",
    secrets: "",
    favorite: false,
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  async function fetchMeals() {
    const { data, error } = await supabase
      .from("pantry_meals")
      .select("*")
      .eq("chef_id", user.id)
      .order("name", { ascending: true });

    if (!error && data) {
      setMeals(data);
    } else {
      console.error("Fetch error:", error?.message);
    }
  }

  async function addMeal() {
    if (!newMealName.trim()) return;

    const { data, error } = await supabase
      .from("pantry_meals")
      .insert([{ chef_id: user.id, name: newMealName }])
      .select();

    if (!error && data) {
      setMeals([...meals, data[0]]);
      setNewMealName("");
    }
  }

  function startEditing(meal: PantryMeal) {
    setEditingId(meal.id);
    setEditData({
      name: meal.name,
      ingredients: meal.ingredients || "",
      notes: meal.notes || "",
      secrets: meal.secrets || "",
      favorite: meal.favorite || false,
    });
  }

  async function saveEdit(id: string) {
    const updatePayload = {
      name: editData.name.trim(),
      ingredients: editData.ingredients.trim() || null,
      notes: editData.notes.trim() || null,
      secrets: editData.secrets.trim() || null,
      favorite: editData.favorite,
    };

    const { error } = await supabase
      .from("pantry_meals")
      .update(updatePayload)
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      fetchMeals();
    } else {
      alert("Failed to save changes: " + error.message);
    }
  }

  async function deleteMeal(id: string) {
    const { error } = await supabase.from("pantry_meals").delete().eq("id", id);
    if (!error) {
      setMeals(meals.filter((m) => m.id !== id));
    }
  }

  return (
    <div className="profile-container">
      <h2>Pantry Meals</h2>

      <div style={{ marginBottom: "1rem", textAlign: "center" }}></div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newMealName}
          placeholder="Add Pantry Meal"
          onChange={(e) => setNewMealName(e.target.value)}
        />
        <button onClick={addMeal}>Add Meal</button>
      </div>

      {meals.map((meal) => (
        <div
          key={meal.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
            padding: ".25rem",
            marginBottom: "0.125rem",
            background: "#f9f9f9",
            textAlign: "left",
          }}
        >
          {editingId === meal.id ? (
            <>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              <input
                type="text"
                value={editData.ingredients}
                placeholder="Ingredients"
                onChange={(e) =>
                  setEditData({ ...editData, ingredients: e.target.value })
                }
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
              <textarea
                rows={2}
                value={editData.notes}
                placeholder="Notes"
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
              <textarea
                rows={2}
                value={editData.secrets}
                placeholder="Secrets (optional)"
                onChange={(e) =>
                  setEditData({ ...editData, secrets: e.target.value })
                }
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
              <div style={{ marginTop: "0.5rem" }}>
                <label>
                  Mark as Favorite
                  <input
                    type="checkbox"
                    checked={editData.favorite}
                    onChange={(e) =>
                      setEditData({ ...editData, favorite: e.target.checked })
                    }
                  />{" "}
                </label>
              </div>
              <div style={{ marginTop: "0.25rem" }}>
                <button onClick={() => saveEdit(meal.id)}>Save</button>{" "}
                <button onClick={() => setEditingId(null)}>Cancel</button>{" "}
                <button onClick={() => deleteMeal(meal.id)}>Delete</button>
              </div>
            </>
          ) : (
            <>
              <h4
                onClick={() => startEditing(meal)}
                style={{
                  cursor: "pointer",
                  marginBottom: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.25rem" }}>
                  {meal.favorite ? "★" : ""}
                </span>
                <span>{meal.name}</span>
              </h4>
              {meal.ingredients && (
                <p>
                  <strong>Ingredients:</strong> {meal.ingredients}
                </p>
              )}
              {/*{meal.notes && (
                <p style={{ fontStyle: "italic" }}>
                  {meal.notes}You can delete
             </p> 
            
              )}*/}
              {/* Secrets could be displayed conditionally in future */}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
