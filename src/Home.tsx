import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to The Dinner Decider</h1>
      <p>Select an action:</p>
      <Link to="/dashboard">Go to Chef Dashboard</Link>
    </div>
  );
}
