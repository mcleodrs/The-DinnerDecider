import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ChefDashboard from "./ChefDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ChefDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
