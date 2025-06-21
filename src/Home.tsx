import { Link } from "react-router-dom";
import Login from "./Login";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to The Dinner Decider</h1>
      <p>Please login:</p>
      <Link to="/login">Login</Link>
      <br />
      <br />
      <Link to="/dashboard">Go to Chef Dashboard</Link>
    </div>
  );
}
