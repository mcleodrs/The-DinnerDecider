import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ChefDashboard from "./ChefDashboard";
import Login from "./Login"; // add this import
import CreateDinner from "./CreateDinner";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ChefDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-event" element={<CreateDinner />} />
      </Routes>
    </Router>
  );
}

export default App;
