import { Link } from "react-router-dom";
import Login from "./Login";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to The What's for Dinner App</h1>
      <h3>
        Brought to you by
        <br />
        The Dinner Decider
      </h3>
      <p>Please login:</p>
      <Link to="/Login">Login</Link>
      <br />
      <br />
      <Link to="/Dashboard">Go to Chef Dashboard</Link>
    </div>
  );
}
