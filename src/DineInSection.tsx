"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type DeliveryOption = {
  id: string;
  chef_id: string;
  name: string;
  service_url: string;
  created_at: string;
};

export default function DineInSection() {
  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [name, setName] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");

  const chefId = "00000000-0000-0000-0000-000000000001"; // Hardcoded chef

  useEffect(() => {
    fetchOptions();
  }, []);

  async function fetchOptions() {
    const { data, error } = await supabase
      .from("dine_in_options")
      .select("*")
      .eq("chef_id", chefId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching dine in options:", error);
    else setOptions(data || []);
  }

  async function addOption() {
    if (!name.trim()) return;

    const { error } = await supabase.from("dine_in_options").insert([
      {
        chef_id: chefId,
        name: name.trim(),
        service_url: serviceUrl.trim(),
      },
    ]);

    if (!error) {
      setName("");
      setServiceUrl("");
      fetchOptions();
    } else {
      console.error("Error adding dine in option:", error);
    }
  }

  async function deleteOption(id: string) {
    const { error } = await supabase
      .from("dine_in_options")
      .delete()
      .eq("id", id);
    if (!error) fetchOptions();
  }

  return (
    <div>
      <h2>Dine In Services</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Service name (e.g. DoorDash)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Optional link (e.g. menu page)"
          value={serviceUrl}
          onChange={(e) => setServiceUrl(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <button onClick={addOption} style={{ marginLeft: "0.5rem" }}>
          ➕ Add
        </button>
      </div>

      {options.length === 0 ? (
        <p>No Dine In options saved.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {options.map((opt) => (
            <li key={opt.id} style={{ marginBottom: "0.5rem" }}>
              <strong>{opt.name}</strong>{" "}
              {opt.service_url && (
                <a href={opt.service_url} target="_blank" rel="noreferrer">
                  🔗
                </a>
              )}
              <button
                onClick={() => deleteOption(opt.id)}
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
