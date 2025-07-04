import { Link } from "react-router-dom";
import "./styles.css";
import Footer from "./pages/Footer";

export default function Home() {
  return (
    <div  className="centered-container">
    <div className="profile-container">
      <h1>🍽️ Welcome to The Dinner Decider</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
        Planning dinner just got easier. Create events, vote on meals, and keep
        the whole family in sync — all in one place.
      </p>

      <Link to="/login">
        <button className="action-button">🔐 Log In to Get Started</button>
      </Link>
    </div>
    </div>
  );
}
