"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Restaurant = {
  id: string;
  chef_id: string;
  name: string;
  location_url: string;
  created_at: string;
};

export default function DineOutSection() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [name, setName] = useState("");
  const [locationUrl, setLocationUrl] = useState("");

  const chefId = "00000000-0000-0000-0000-000000000001"; // Replace later with dynamic user

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants() {
    const { data, error } = await supabase
      .from("dine_out_restaurants")
      .select("*")
      .eq("chef_id", chefId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching restaurants:", error);
    else setRestaurants(data || []);
  }

  async function addRestaurant() {
    if (!name.trim()) return;

    const { error } = await supabase.from("dine_out_restaurants").insert([
      {
        chef_id: chefId,
        name: name.trim(),
        location_url: locationUrl.trim(),
      },
    ]);

    if (!error) {
      setName("");
      setLocationUrl("");
      fetchRestaurants();
    } else {
      console.error("Error adding restaurant:", error);
    }
  }

  async function deleteRestaurant(id: string) {
    const { error } = await supabase
      .from("dine_out_restaurants")
      .delete()
      .eq("id", id);
    if (!error) fetchRestaurants();
  }

  return (
    <div>
      <h2>Dine Out Locations</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Restaurant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Optional Google Maps URL"
          value={locationUrl}
          onChange={(e) => setLocationUrl(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <button onClick={addRestaurant} style={{ marginLeft: "0.5rem" }}>
          ➕ Add
        </button>
      </div>

      {restaurants.length === 0 ? (
        <p>No restaurants saved.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {restaurants.map((r) => (
            <li key={r.id} style={{ marginBottom: "0.5rem" }}>
              <strong>{r.name}</strong>{" "}
              {r.location_url && (
                <a href={r.location_url} target="_blank" rel="noreferrer">
                  📍 Map
                </a>
              )}
              <button
                onClick={() => deleteRestaurant(r.id)}
                style={{ marginLeft: "0.5rem" }}
              >
                ❌ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
