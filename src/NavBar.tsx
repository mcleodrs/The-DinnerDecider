// src/NavBar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function NavBar() {
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (data?.role) setUserRole(data.role);
    };

    loadRole();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/">🏠 Home</Link>
      <Link to="/user">👤 Profile</Link>
      {userRole === "Chef" && <Link to="/dashboard">🍽️ Chef</Link>}
      <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button>
    </nav>
  );
}
