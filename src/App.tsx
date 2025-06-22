import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import ChefDashboard from "./ChefDashboard";
import CreateDinner from "./CreateDinner";
import UserProfile from "./UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ChefDashboard />} />
        <Route path="/create" element={<CreateDinner />} />
        <Route path="/user" element={<UserProfile />} /> {/* NEW ROUTE */}
      </Routes>
    </Router>
  );
}

export default App;
