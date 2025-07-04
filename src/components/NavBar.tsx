// src/components/NavBar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth"; // path to your updated auth context
import "../styles.css"; // Make sure styles.css is in /src

const NavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav>
      <div className="nav-links">
        <Link to="/">🏠 Home</Link>
        {user && (
          <>
            <Link to="/user">👤 Profile</Link>
            <Link to="/dashboard">🍽️ Chef Dashboard</Link>
          </>
        )}
      </div>

      {user && (
        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      )}
    </nav>
  );
};

export default NavBar;
