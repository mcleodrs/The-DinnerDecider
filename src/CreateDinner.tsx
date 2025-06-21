"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type PantryMeal = {
  id: string;
  name: string;
  is_favorite: boolean;
};

type DineOutOption = {
  id: string;
  name: string;
  location_url: string;
};

export default function CreateDinner() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [details, setDetails] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [pantryMeals, setPantryMeals] = useState<PantryMeal[]>([]);
  const [dineOutOptions, setDineOutOptions] = useState<DineOutOption[]>([]);

  const chefId = "00000000-0000-0000-0000-000000000001";

  useEffect(() => {
    async function loadPantryMeals() {
      const { data, error } = await supabase
        .from("pantry_meals")
        .select("id, name, is_favorite")
        .eq("chef_id", chefId);

      if (data) setPantryMeals(data);
      else console.error("Error loading pantry meals:", error);
    }

    loadPantryMeals();
  }, []);

  useEffect(() => {
    async function loadDineOutOptions() {
      const { data, error } = await supabase
        .from("dine_out_restaurants")
        .select("id, name, location_url")
        .eq("chef_id", chefId);

      if (data) setDineOutOptions(data);
      else console.error("Error loading dine out options:", error);
    }

    loadDineOutOptions();
  }, []);

  function handleToggleOption(option: string) {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  }

  async function handleSubmit() {
    if (!title || !eventDate || !eventTime) {
      alert("Please fill out all required fields.");
      return;
    }

    const { data: event, error } = await supabase
      .from("events")
      .insert([
        {
          title,
          location,
          event_date: eventDate,
          event_time: eventTime,
          details,
          chef_id: chefId,
          theme_color: "red",
          theme_style: "gingham",
        },
      ])
      .select()
      .single();

    if (error || !event) {
      alert("Error creating event.");
      console.error(error);
      return;
    }

    // Insert dinner options into event_dinner_options
    const optionRows = selectedOptions.map((label) => ({
      event_id: event.id,
      label,
      category: "pantry", // update dynamically if needed
      created_by: chefId,
    }));

    const { error: optionError } = await supabase
      .from("event_dinner_options")
      .insert(optionRows);

    if (optionError) {
      console.error("Error inserting dinner options:", optionError);
      alert("Failed to create dinner options.");
      return;
    }

    alert(`Dinner created: ${title}`);
    setTitle("");
    setLocation("");
    setEventDate("");
    setEventTime("");
    setDetails("");
    setSelectedOptions([]);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Create Dinner</h1>

      <div>
        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Location:</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />

        <label>Date:</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />

        <label>Time:</label>
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />

        <label>Details:</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      <h3>Choose Dinner Types:</h3>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {["pantry", "leftovers", "dine_in", "dine_out"].map((type) => (
          <button
            key={type}
            onClick={() => handleToggleOption(type)}
            style={{
              padding: "1rem",
              backgroundColor: selectedOptions.includes(type)
                ? "#f0c040"
                : "#eee",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {selectedOptions.includes("pantry") && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Pantry Meals:</strong>
          {pantryMeals.length === 0 ? (
            <p>No pantry meals saved.</p>
          ) : (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {pantryMeals.map((meal) => (
                <li key={meal.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(meal.name)}
                      onChange={() => handleToggleOption(meal.name)}
                    />
                    {meal.is_favorite ? "⭐ " : ""}
                    {meal.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedOptions.includes("dine_out") && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Dine Out Options:</strong>
          {dineOutOptions.length === 0 ? (
            <p>No dine out locations saved.</p>
          ) : (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {dineOutOptions.map((option) => (
                <li key={option.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option.name)}
                      onChange={() => handleToggleOption(option.name)}
                    />
                    {option.name}
                    {option.location_url && (
                      <a
                        href={option.location_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginLeft: "0.5rem" }}
                      >
                        📍
                      </a>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedOptions.includes("dine_in") && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Dine In Options:</strong>
          <p>Choose from popular delivery platforms:</p>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {["DoorDash", "UberEats"].map((platform) => (
              <li key={platform}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(platform)}
                    onChange={() => handleToggleOption(platform)}
                  />
                  {platform}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>
        Submit Dinner
      </button>
    </main>
  );
}
