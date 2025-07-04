import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";
import "../styles.css";

function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <nav>
            <div className="nav-links">
                <Link to="/">🏠 Home</Link>
                {user && (
                    <>
                        <Link to="/user">👤 Profile</Link>
                        <Link to="/dashboard">🔍 Chef Dashboard</Link>
                    </>
                )}
            </div>
            {user && (
                <button className="logout-button" onClick={handleLogout}>
                    📕 Logout
                </button>
            )}
        </nav>
    );
}

export default NavBar;
