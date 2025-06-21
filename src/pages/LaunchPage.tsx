"use client";

import React from "react";

export default function LaunchPage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          What’s for dinner?
        </h1>
        <p style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
          DinnerDecider makes group meal planning smart, simple, and democratic.
        </p>

        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            How it works:
          </h2>
          <ul style={{ lineHeight: "1.75", paddingLeft: "1.25rem" }}>
            <li>One person becomes the Chef and creates the dinner event</li>
            <li>The Chef selects dinner options for others to choose from</li>
            <li>Diners RSVP and vote on what they’d like</li>
            <li>The Chef sees the results and makes the final decision</li>
          </ul>
        </section>

        <section style={{ marginTop: "2rem" }}>
          <button
            style={{
              backgroundColor: "#e03e36",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => alert("Beta access coming soon!")}
          >
            Join the Beta
          </button>
        </section>
      </div>
    </main>
  );
}
