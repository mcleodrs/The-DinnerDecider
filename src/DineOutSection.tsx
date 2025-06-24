import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./auth";
import { useNavigate } from "react-router-dom";

type DineOutOption = {
  id: string;
  chef_id: string;
  name: string;
  url?: string;
  notes?: string;
  favorite?: boolean;
};

export default function DineOutSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [options, setOptions] = useState<DineOutOption[]>([]);
  const [newOptionName, setNewOptionName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    url: "",
    notes: "",
    favorite: false,
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  async function fetchOptions() {
    const { data, error } = await supabase
      .from("dine_out_restaurants")
      .select("*")
      .eq("chef_id", user.id)
      .order("name", { ascending: true });

    if (!error && data) {
      setOptions(data);
    } else {
      console.error("Fetch error:", error?.message);
    }
  }

  async function addOption() {
    if (!newOptionName.trim()) return;

    const { data, error } = await supabase
      .from("dine_out_restaurants")
      .insert([{ chef_id: user.id, name: newOptionName }])
      .select();

    if (!error && data) {
      setOptions([...options, data[0]]);
      setNewOptionName("");
    }
  }

  function startEditing(option: DineOutOption) {
    setEditingId(option.id);
    setEditData({
      name: option.name,
      url: option.url || "",
      notes: option.notes || "",
      favorite: option.favorite || false,
    });
  }

  async function saveEdit(id: string) {
    const updatePayload = {
      name: editData.name.trim(),
      url: editData.url.trim() || null,
      notes: editData.notes.trim() || null,
      favorite: editData.favorite,
    };

    const { error } = await supabase
      .from("dine_out_restaurants")
      .update(updatePayload)
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      fetchOptions();
    } else {
      alert("Failed to save changes: " + error.message);
    }
  }

  async function deleteOption(id: string) {
    const { error } = await supabase
      .from("dine_out_restaurants")
      .delete()
      .eq("id", id);

    if (!error) {
      setOptions(options.filter((opt) => opt.id !== id));
    }
  }

  return (
    <div className="profile-container">
      <h2>Dine Out Options</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newOptionName}
          placeholder="Add Dine Out Option"
          onChange={(e) => setNewOptionName(e.target.value)}
        />
        <button onClick={addOption}>Add Option</button>
      </div>

      {options.map((option) => (
        <div
          key={option.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "0.5rem",
            background: "#f9f9f9",
            textAlign: "left",
          }}
        >
          {editingId === option.id ? (
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
                value={editData.url}
                placeholder="Optional URL"
                onChange={(e) =>
                  setEditData({ ...editData, url: e.target.value })
                }
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
              <textarea
                rows={2}
                value={editData.notes}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                placeholder="Notes (optional)"
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
              <div style={{ marginTop: "0.5rem" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={editData.favorite}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        favorite: e.target.checked,
                      })
                    }
                  />{" "}
                  Mark as Favorite
                </label>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={() => saveEdit(option.id)}>Save</button>{" "}
                <button onClick={() => setEditingId(null)}>Cancel</button>{" "}
                <button onClick={() => deleteOption(option.id)}>Delete</button>
              </div>
            </>
          ) : (
            <>
              <h4
                onClick={() => startEditing(option)}
                style={{
                  cursor: "pointer",
                  marginBottom: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.25rem" }}>
                  {option.favorite ? "★" : ""}
                </span>
                <span>{option.name}</span>
              </h4>
              {option.notes && (
                <p style={{ fontStyle: "italic", marginBottom: "0.5rem" }}>
                  {option.notes}
                </p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
