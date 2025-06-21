import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ChefDashboard from "./ChefDashboard";
import Login from "./Login"; // add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ChefDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
